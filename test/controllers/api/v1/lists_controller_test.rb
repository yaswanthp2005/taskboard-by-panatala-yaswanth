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

  def test_reorder_updates_list_positions
    patch reorder_api_v1_board_lists_path(@board.slug),
      params: { list_ids: [@third_list.id, @first_list.id, @second_list.id] },
      headers: headers(@owner),
      as: :json

    assert_response :success
    assert_equal [1, 2, 3], @board.lists.order(:position).pluck(:position)
    assert_equal [@third_list, @first_list, @second_list], @board.lists.to_a
    assert_equal I18n.t("successfully_updated", entity: "Lists"), response_body["notice"]
  end

  def test_reorder_allows_board_member
    create(:board_member, board: @board, user: @member)

    patch reorder_api_v1_board_lists_path(@board.slug),
      params: { list_ids: [@second_list.id, @third_list.id, @first_list.id] },
      headers: headers(@member),
      as: :json

    assert_response :success
    assert_equal [@second_list, @third_list, @first_list], @board.lists.to_a
  end

  def test_reorder_rejects_duplicate_list_ids
    patch reorder_api_v1_board_lists_path(@board.slug),
      params: { list_ids: [@first_list.id, @first_list.id, @second_list.id] },
      headers: headers(@owner),
      as: :json

    assert_response :unprocessable_entity
    assert_equal I18n.t("list.reorder.invalid"), response_body["error"]
  end

  def test_reorder_rejects_incomplete_list_ids
    patch reorder_api_v1_board_lists_path(@board.slug),
      params: { list_ids: [@first_list.id, @second_list.id] },
      headers: headers(@owner),
      as: :json

    assert_response :unprocessable_entity
    assert_equal I18n.t("list.reorder.incomplete"), response_body["error"]
  end

  def test_reorder_rejects_list_from_another_board
    other_board = create(:board, owner: @owner)
    other_list = create(:list, board: other_board, title: "Other")

    patch reorder_api_v1_board_lists_path(@board.slug),
      params: { list_ids: [@first_list.id, @second_list.id, other_list.id] },
      headers: headers(@owner),
      as: :json

    assert_response :not_found
  end

  def test_reorder_rejects_non_member
    patch reorder_api_v1_board_lists_path(@board.slug),
      params: { list_ids: [@third_list.id, @first_list.id, @second_list.id] },
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
    assert_equal I18n.t("successfully_deleted", count: 1, entity: "List"), response_body["notice"]
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
end
