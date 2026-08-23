# frozen_string_literal: true

require "test_helper"

class Api::V1::ChecklistItemsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @owner = create(:user)
    @member = create(:user)
    @other_user = create(:user)
    @board = create(:board, owner: @owner)
    @list = create(:list, board: @board, title: "To Do")
    @card = create(:card, list: @list, title: "Fix login bug")
    @checklist_item = create(:checklist_item, card: @card, text: "Write tests")
  end

  def test_create_adds_checklist_item_for_owner
    assert_difference -> { @card.checklist_items.count }, 1 do
      post api_v1_card_checklist_items_path(@card),
        params: { checklist_item: { text: "Review pull request" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :success
    item = @card.checklist_items.find_by!(text: "Review pull request")
    assert_not item.is_complete
    assert_equal I18n.t("successfully_created", entity: "Checklist item"), response_body["notice"]
  end

  def test_create_allows_board_member
    create(:board_member, board: @board, user: @member)

    assert_difference -> { @card.checklist_items.count }, 1 do
      post api_v1_card_checklist_items_path(@card),
        params: { checklist_item: { text: "Review pull request" } },
        headers: headers(@member),
        as: :json
    end

    assert_response :success
  end

  def test_create_rejects_blank_text
    assert_no_difference -> { @card.checklist_items.count } do
      post api_v1_card_checklist_items_path(@card),
        params: { checklist_item: { text: "" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :unprocessable_entity
    assert_equal "Text can't be blank", response_body["error"]
  end

  def test_create_rejects_non_member
    assert_no_difference -> { @card.checklist_items.count } do
      post api_v1_card_checklist_items_path(@card),
        params: { checklist_item: { text: "Unauthorized item" } },
        headers: headers(@other_user),
        as: :json
    end

    assert_response :not_found
  end

  def test_update_marks_checklist_item_is_complete
    patch api_v1_checklist_item_path(@checklist_item),
      params: { checklist_item: { is_complete: true } },
      headers: headers(@owner),
      as: :json

    assert_response :success
    assert @checklist_item.reload.is_complete
    assert_equal I18n.t("successfully_updated", entity: "Checklist item"), response_body["notice"]
  end

  def test_update_allows_board_member
    create(:board_member, board: @board, user: @member)

    patch api_v1_checklist_item_path(@checklist_item),
      params: { checklist_item: { text: "Updated item text" } },
      headers: headers(@member),
      as: :json

    assert_response :success
    assert_equal "Updated item text", @checklist_item.reload.text
  end

  def test_update_rejects_checklist_item_on_other_users_board
    other_board = create(:board, owner: @other_user)
    other_list = create(:list, board: other_board, title: "Done")
    other_card = create(:card, list: other_list, title: "Other card")
    other_item = create(:checklist_item, card: other_card, text: "Other item")

    patch api_v1_checklist_item_path(other_item),
      params: { checklist_item: { text: "Updated" } },
      headers: headers(@owner),
      as: :json

    assert_response :not_found
    assert_equal "Other item", other_item.reload.text
  end

  def test_update_rejects_non_member
    patch api_v1_checklist_item_path(@checklist_item),
      params: { checklist_item: { is_complete: true } },
      headers: headers(@other_user),
      as: :json

    assert_response :not_found
    assert_not @checklist_item.reload.is_complete
  end

  def test_destroy_deletes_checklist_item_for_owner
    assert_difference -> { ChecklistItem.count }, -1 do
      delete api_v1_checklist_item_path(@checklist_item),
        headers: headers(@owner),
        as: :json
    end

    assert_response :success
    assert_equal I18n.t("successfully_deleted", count: 1, entity: "Checklist item"), response_body["notice"]
  end

  def test_destroy_allows_board_member
    create(:board_member, board: @board, user: @member)

    assert_difference -> { ChecklistItem.count }, -1 do
      delete api_v1_checklist_item_path(@checklist_item),
        headers: headers(@member),
        as: :json
    end

    assert_response :success
  end

  def test_destroy_rejects_non_member
    assert_no_difference -> { ChecklistItem.count } do
      delete api_v1_checklist_item_path(@checklist_item),
        headers: headers(@other_user),
        as: :json
    end

    assert_response :not_found
    assert ChecklistItem.exists?(@checklist_item.id)
  end

  def test_bulk_delete_deletes_all_checklist_items_for_owner
    create(:checklist_item, card: @card, text: "Deploy")

    assert_difference -> { @card.checklist_items.count }, -2 do
      delete bulk_delete_api_v1_card_checklist_items_path(@card),
        headers: headers(@owner),
        as: :json
    end

    assert_response :success
    assert_equal I18n.t("successfully_deleted", count: 2, entity: "Checklist item"), response_body["notice"]
  end

  def test_bulk_delete_allows_board_member
    create(:board_member, board: @board, user: @member)

    assert_difference -> { @card.checklist_items.count }, -1 do
      delete bulk_delete_api_v1_card_checklist_items_path(@card),
        headers: headers(@member),
        as: :json
    end

    assert_response :success
  end

  def test_bulk_delete_rejects_non_member
    assert_no_difference -> { @card.checklist_items.count } do
      delete bulk_delete_api_v1_card_checklist_items_path(@card),
        headers: headers(@other_user),
        as: :json
    end

    assert_response :not_found
    assert ChecklistItem.exists?(@checklist_item.id)
  end
end
