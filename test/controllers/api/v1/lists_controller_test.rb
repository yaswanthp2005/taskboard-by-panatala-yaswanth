# frozen_string_literal: true

require "test_helper"

class Api::V1::ListsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @owner = create(:user)
    @member = create(:user)
    @other_user = create(:user)
    @board = create(:board, owner: @owner)
    @first_list = create(:list, board: @board, title: "To Do")
    @second_list = create(:list, board: @board, title: "In Progress")
    @third_list = create(:list, board: @board, title: "Done")
  end

  def test_create_adds_list_for_owner
    assert_difference -> { @board.lists.count }, 1 do
      post api_v1_board_lists_path(@board.slug),
        params: { list: { title: "Backlog" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :success
    list = @board.lists.find_by!(title: "Backlog")
    assert_equal 4, list.position
    assert_equal I18n.t("successfully_created", entity: I18n.t("entities.list")), response_body["notice"]
  end

  def test_create_allows_board_member
    create(:board_member, board: @board, user: @member)

    assert_difference -> { @board.lists.count }, 1 do
      post api_v1_board_lists_path(@board.slug),
        params: { list: { title: "Review" } },
        headers: headers(@member),
        as: :json
    end

    assert_response :success
  end

  def test_create_rejects_blank_title
    assert_no_difference -> { @board.lists.count } do
      post api_v1_board_lists_path(@board.slug),
        params: { list: { title: "" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :unprocessable_entity
  end

  def test_create_rejects_non_member
    assert_no_difference -> { @board.lists.count } do
      post api_v1_board_lists_path(@board.slug),
        params: { list: { title: "Backlog" } },
        headers: headers(@other_user),
        as: :json
    end

    assert_response :not_found
  end

  def test_move_updates_list_position
    patch move_api_v1_board_list_path(@board.slug, @third_list),
      params: { position: 1 },
      headers: headers(@owner),
      as: :json

    assert_response :success
    assert_equal [1, 2, 3], @board.lists.order(:position).pluck(:position)
    assert_equal [@third_list, @first_list, @second_list], @board.lists.to_a
    assert_equal I18n.t("successfully_updated", entity: I18n.t("entities.list")), response_body["notice"]
  end

  def test_move_allows_board_member
    create(:board_member, board: @board, user: @member)

    patch move_api_v1_board_list_path(@board.slug, @second_list),
      params: { position: 1 },
      headers: headers(@member),
      as: :json

    assert_response :success
    assert_equal [@second_list, @first_list, @third_list], @board.lists.to_a
  end

  def test_move_rejects_invalid_position
    patch move_api_v1_board_list_path(@board.slug, @first_list),
      params: { position: 0 },
      headers: headers(@owner),
      as: :json

    assert_response :unprocessable_entity
    assert_equal I18n.t("list.move.invalid_position"), response_body["error"]
  end

  def test_move_rejects_non_member
    patch move_api_v1_board_list_path(@board.slug, @third_list),
      params: { position: 1 },
      headers: headers(@other_user),
      as: :json

    assert_response :not_found
  end

  def test_destroy_deletes_list_and_cascades_cards
    card = create(:card, list: @first_list, title: "Fix login bug")

    assert_difference -> { @board.lists.count }, -1 do
      assert_difference -> { Card.count }, -1 do
        delete api_v1_board_list_path(@board.slug, @first_list),
          headers: headers(@owner),
          as: :json
      end
    end

    assert_response :success
    assert_not List.exists?(card.list_id)
    assert_equal I18n.t("successfully_deleted", count: 1, entity: I18n.t("entities.list")), response_body["notice"]
  end

  def test_destroy_allows_board_member
    create(:board_member, board: @board, user: @member)

    assert_difference -> { @board.lists.count }, -1 do
      delete api_v1_board_list_path(@board.slug, @second_list),
        headers: headers(@member),
        as: :json
    end

    assert_response :success
  end

  def test_destroy_rejects_non_member
    assert_no_difference -> { @board.lists.count } do
      delete api_v1_board_list_path(@board.slug, @first_list),
        headers: headers(@other_user),
        as: :json
    end

    assert_response :not_found
  end

  def test_update_records_activity
    assert_difference -> { @board.activities.where(action: Constants::Activity::LIST_UPDATED).count }, 1 do
      patch api_v1_board_list_path(@board.slug, @first_list),
        params: { list: { title: "Updated list" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :success
    activity = @board.activities.order(:created_at).last
    assert_equal Constants::Activity::LIST_UPDATED, activity.action
    assert_equal @owner, activity.actor
    assert_equal "Updated list", activity.metadata["list_title"]
  end
end
