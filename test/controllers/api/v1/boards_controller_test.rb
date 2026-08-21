# frozen_string_literal: true

require "test_helper"

class Api::V1::BoardsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @owner = create(:user)
    @other_user = create(:user)
  end

  def test_index_returns_boards_for_current_user
    board = create(:board, name: "My Board", owner: @owner)
    create(:board, name: "Other Board", owner: @other_user)

    get api_v1_boards_path, headers: headers(@owner), as: :json

    assert_response :success
    response_boards = response_body["boards"]
    assert_equal 1, response_boards.size
    assert_equal board.name, response_boards.first["name"]
    assert_equal board.slug, response_boards.first["slug"]
    assert_equal board.description, response_boards.first["description"]
    assert_equal board.color, response_boards.first["color"]
    assert_equal 1, response_body.dig("pagination", "count")
    assert_equal 1, response_body.dig("pagination", "page")
    assert_equal 10, response_body.dig("pagination", "limit")
  end

  def test_index_includes_boards_shared_with_user
    shared_board = create(:board, name: "Shared Board", owner: @other_user)
    create(:board_member, board: shared_board, user: @owner)

    get api_v1_boards_path, headers: headers(@owner), as: :json

    assert_response :success
    board_names = response_body["boards"].pluck("name")
    assert_includes board_names, "Shared Board"
  end

  def test_index_paginates_boards
    11.times do |index|
      create(:board, name: "Board #{index}", owner: @owner)
    end

    get api_v1_boards_path, params: { page: 2 }, headers: headers(@owner), as: :json

    assert_response :success
    assert_equal 11, response_body.dig("pagination", "count")
    assert_equal 2, response_body.dig("pagination", "page")
    assert_equal 1, response_body["boards"].size
  end

  def test_index_returns_empty_list_when_user_has_no_boards
    get api_v1_boards_path, headers: headers(@owner), as: :json

    assert_response :success
    assert_empty response_body["boards"]
    assert_equal 0, response_body.dig("pagination", "count")
  end

  def test_index_rejects_unauthenticated_request
    get api_v1_boards_path, as: :json

    assert_response :unauthorized
  end

  def test_index_filters_by_search
    product_board = create(:board, name: "Product Roadmap", owner: @owner)
    create(:board, name: "Marketing Campaigns", owner: @owner)
    create(:board, name: "Product Ideas", owner: @other_user)

    get api_v1_boards_path, params: { search: "product" }, headers: headers(@owner), as: :json

    assert_response :success
    response_boards = response_body["boards"]
    assert_equal 1, response_boards.size
    assert_equal product_board.name, response_boards.first["name"]
  end

  def test_show_returns_board_for_owner
    board = create(:board, name: "Product Roadmap", owner: @owner)

    get api_v1_board_path(board), headers: headers(@owner), as: :json

    assert_response :success
    assert_equal board.name, response_body["name"]
    assert_equal board.slug, response_body["slug"]
    assert response_body["is_owner"]
  end

  def test_show_returns_board_for_member
    board = create(:board, name: "Shared Board", owner: @other_user)
    create(:board_member, board:, user: @owner)

    get api_v1_board_path(board), headers: headers(@owner), as: :json

    assert_response :success
    assert_equal "Shared Board", response_body["name"]
    assert_not response_body["is_owner"]
  end

  def test_show_rejects_non_member
    board = create(:board, name: "Other Board", owner: @other_user)

    get api_v1_board_path(board), headers: headers(@owner), as: :json

    assert_response :not_found
  end

  def test_create_adds_board_for_current_user
    assert_difference -> { @owner.boards.count }, 1 do
      post api_v1_boards_path,
        params: { board: { name: "New Board", color: "#4F46E5" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :success
    board = @owner.boards.find_by!(name: "New Board")
    assert_equal "#4F46E5", board.color
    assert_equal "new-board", board.slug
    assert_equal I18n.t("successfully_created", entity: "Board"), response_body["notice"]
  end

  def test_create_rejects_blank_name
    assert_no_difference "Board.count" do
      post api_v1_boards_path,
        params: { board: { name: "", color: "#4F46E5" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :unprocessable_entity
    assert_equal "Name can't be blank", response_body["error"]
  end

  def test_create_rejects_unauthenticated_request
    assert_no_difference "Board.count" do
      post api_v1_boards_path,
        params: { board: { name: "New Board" } },
        as: :json
    end

    assert_response :unauthorized
  end

  def test_update_changes_board_name
    board = create(:board, name: "Product Roadmap", owner: @owner)

    patch api_v1_board_path(board),
      params: { board: { name: "Updated Roadmap" } },
      headers: headers(@owner),
      as: :json

    assert_response :success
    assert_equal I18n.t("successfully_updated", entity: "Board"), response_body["notice"]
    assert_equal "Updated Roadmap", board.reload.name
    assert_equal "product-roadmap", board.slug
  end

  def test_update_rejects_blank_name
    board = create(:board, name: "Product Roadmap", owner: @owner)

    patch api_v1_board_path(board),
      params: { board: { name: "" } },
      headers: headers(@owner),
      as: :json

    assert_response :unprocessable_entity
    assert_equal "Name can't be blank", response_body["error"]
  end

  def test_update_rejects_board_from_another_user
    board = create(:board, name: "Other Board", owner: @other_user)

    patch api_v1_board_path(board),
      params: { board: { name: "Updated Board" } },
      headers: headers(@owner),
      as: :json

    assert_response :not_found
  end

  def test_update_rejects_board_member
    board = create(:board, name: "Shared Board", owner: @other_user)
    create(:board_member, board:, user: @owner)

    patch api_v1_board_path(board),
      params: { board: { name: "Updated Board" } },
      headers: headers(@owner),
      as: :json

    assert_response :forbidden
    assert_equal "Shared Board", board.reload.name
  end

  def test_destroy_deletes_board
    board = create(:board, name: "Product Roadmap", owner: @owner)

    assert_difference "Board.count", -1 do
      delete api_v1_board_path(board), headers: headers(@owner), as: :json
    end

    assert_response :success
    assert_equal I18n.t("successfully_deleted", count: 1, entity: "Board"), response_body["notice"]
  end

  def test_destroy_rejects_board_from_another_user
    board = create(:board, name: "Other Board", owner: @other_user)

    assert_no_difference "Board.count" do
      delete api_v1_board_path(board), headers: headers(@owner), as: :json
    end

    assert_response :not_found
  end

  def test_destroy_rejects_board_member
    board = create(:board, name: "Shared Board", owner: @other_user)
    create(:board_member, board:, user: @owner)

    assert_no_difference "Board.count" do
      delete api_v1_board_path(board), headers: headers(@owner), as: :json
    end

    assert_response :forbidden
  end
end
