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
    assert_equal board.description, response_boards.first["description"]
    assert_equal board.color, response_boards.first["color"]
    assert_equal 1, response_body.dig("pagination", "count")
    assert_equal 1, response_body.dig("pagination", "page")
    assert_equal 10, response_body.dig("pagination", "limit")
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
end
