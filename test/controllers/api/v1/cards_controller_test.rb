# frozen_string_literal: true

require "test_helper"

class Api::V1::CardsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @owner = create(:user)
    @member = create(:user)
    @other_user = create(:user)
    @board = create(:board, owner: @owner)
    @list = create(:list, board: @board, title: "To Do")
    @card = create(:card, list: @list, title: "Fix login bug")
  end

  def test_create_adds_card_to_list_for_owner
    assert_difference -> { @list.cards.count }, 1 do
      post api_v1_board_list_cards_path(@board.slug, @list),
        params: { card: { title: "Write tests" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :success
    card = @list.cards.find_by!(title: "Write tests")
    assert_equal 2, card.position
    assert_equal I18n.t("successfully_created", entity: "Card"), response_body["notice"]
  end

  def test_create_adds_card_to_list_for_member
    create(:board_member, board: @board, user: @member)

    assert_difference -> { @list.cards.count }, 1 do
      post api_v1_board_list_cards_path(@board.slug, @list),
        params: { card: { title: "Review pull request" } },
        headers: headers(@member),
        as: :json
    end

    assert_response :success
    assert_equal "Review pull request", @list.cards.last.title
  end

  def test_create_rejects_blank_title
    assert_no_difference -> { @list.cards.count } do
      post api_v1_board_list_cards_path(@board.slug, @list),
        params: { card: { title: "" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :unprocessable_entity
    assert_equal "Title can't be blank", response_body["error"]
  end

  def test_create_rejects_non_member
    assert_no_difference -> { @list.cards.count } do
      post api_v1_board_list_cards_path(@board.slug, @list),
        params: { card: { title: "Unauthorized card" } },
        headers: headers(@other_user),
        as: :json
    end

    assert_response :not_found
  end

  def test_index_filters_cards_by_search
    matching_card = @card
    create(:card, list: @list, title: "Write documentation")
    done_list = create(:list, board: @board, title: "Done")
    create(:card, list: done_list, title: "Deploy release")

    get api_v1_board_cards_path(@board.slug),
      params: { search: "login" },
      headers: headers(@owner),
      as: :json

    assert_response :success
    response_lists = response_body["lists"]
    assert_equal 2, response_lists.size

    todo_cards = response_lists.find { |list| list["id"] == @list.id }["cards"]
    done_cards = response_lists.find { |list| list["id"] == done_list.id }["cards"]

    assert_equal 1, todo_cards.size
    assert_equal matching_card.id, todo_cards.first["id"]
    assert_equal "Fix login bug", todo_cards.first["title"]
    assert_empty done_cards
  end

  def test_index_search_is_case_insensitive
    create(:card, list: @list, title: "Write documentation")

    get api_v1_board_cards_path(@board.slug),
      params: { search: "LOGIN" },
      headers: headers(@owner),
      as: :json

    assert_response :success
    cards = response_body.dig("lists", 0, "cards")
    assert_equal 1, cards.size
    assert_equal @card.id, cards.first["id"]
  end

  def test_index_rejects_non_member
    get api_v1_board_cards_path(@board.slug),
      params: { search: "login" },
      headers: headers(@other_user),
      as: :json

    assert_response :not_found
  end

  def test_show_allows_board_owner
    @card.update!(description: "Login is broken on Safari", due_date: Date.new(2026, 8, 25))

    get api_v1_card_path(@card), headers: headers(@owner), as: :json

    assert_response :success
    assert_equal @card.title, response_body["title"]
    assert_equal "Login is broken on Safari", response_body["description"]
    assert_equal "2026-08-25", response_body["due_date"]
  end

  def test_show_allows_board_member
    create(:board_member, board: @board, user: @member)

    get api_v1_card_path(@card), headers: headers(@member), as: :json

    assert_response :success
    assert_equal @card.title, response_body["title"]
  end

  def test_show_rejects_non_member
    get api_v1_card_path(@card), headers: headers(@other_user), as: :json

    assert_response :not_found
  end

  def test_update_allows_board_member
    create(:board_member, board: @board, user: @member)

    patch api_v1_card_path(@card),
      params: {
        card: {
          title: "Updated card title",
          description: "Updated description",
          due_date: "2026-09-01"
        }
      },
      headers: headers(@member),
      as: :json

    assert_response :success
    @card.reload
    assert_equal "Updated card title", @card.title
    assert_equal "Updated description", @card.description
    assert_equal Date.new(2026, 9, 1), @card.due_date
  end

  def test_update_clears_due_date
    @card.update!(due_date: Date.new(2026, 8, 25))

    patch api_v1_card_path(@card),
      params: { card: { due_date: nil } },
      headers: headers(@owner),
      as: :json

    assert_response :success
    assert_nil @card.reload.due_date
  end

  def test_update_rejects_non_member
    patch api_v1_card_path(@card),
      params: { card: { title: "Updated card title" } },
      headers: headers(@other_user),
      as: :json

    assert_response :not_found
    assert_equal "Fix login bug", @card.reload.title
  end

  def test_show_includes_attached_labels
    bug_label = create(:label, board: @board, name: "Bug", color: "#EF4444")
    @card.update!(label_ids: [bug_label.id])

    get api_v1_card_path(@card), headers: headers(@owner), as: :json

    assert_response :success
    assert_equal 1, response_body["labels"].size
    assert_equal bug_label.id, response_body["labels"].first["id"]
    assert_equal "Bug", response_body["labels"].first["name"]
    assert_equal "#EF4444", response_body["labels"].first["color"]
  end

  def test_show_includes_checklist_items
    completed_item = create(:checklist_item, card: @card, text: "Done task", is_complete: true)
    pending_item = create(:checklist_item, card: @card, text: "Pending task")

    get api_v1_card_path(@card), headers: headers(@owner), as: :json

    assert_response :success
    assert_equal 2, response_body["checklist_items"].size
    assert_equal [completed_item.id, pending_item.id], response_body["checklist_items"].pluck("id")
    assert_equal [true, false], response_body["checklist_items"].pluck("is_complete")
  end

  def test_update_attaches_labels
    bug_label = create(:label, board: @board, name: "Bug")
    feature_label = create(:label, board: @board, name: "Feature")

    patch api_v1_card_path(@card),
      params: { card: { label_ids: [bug_label.id, feature_label.id] } },
      headers: headers(@owner),
      as: :json

    assert_response :success
    assert_equal [bug_label.id, feature_label.id].sort, @card.reload.labels.pluck(:id).sort
  end

  def test_update_detaches_labels
    bug_label = create(:label, board: @board, name: "Bug")
    @card.update!(label_ids: [bug_label.id])

    patch api_v1_card_path(@card),
      params: { card: { label_ids: [] } },
      headers: headers(@owner),
      as: :json

    assert_response :success
    assert_empty @card.reload.labels
  end

  def test_update_rejects_label_from_other_board
    other_board = create(:board, owner: @owner)
    other_label = create(:label, board: other_board, name: "Other")

    patch api_v1_card_path(@card),
      params: { card: { label_ids: [other_label.id] } },
      headers: headers(@owner),
      as: :json

    assert_response :unprocessable_entity
    assert_equal "Labels #{I18n.t('card.labels.must_belong_to_board')}", response_body["error"]
    assert_empty @card.reload.labels
  end

  def test_move_reorders_card_within_same_list
    second_card = create(:card, list: @list, title: "Write tests")
    third_card = create(:card, list: @list, title: "Review PR")

    patch move_api_v1_card_path(third_card),
      params: { list_id: @list.id, position: 1 },
      headers: headers(@owner),
      as: :json

    assert_response :success
    assert_equal [third_card, @card, second_card], @list.cards.to_a
    assert_equal [1, 2, 3], @list.cards.pluck(:position)
    assert_equal I18n.t("successfully_updated", entity: "Card"), response_body["notice"]
  end

  def test_move_allows_board_member_to_reorder_within_list
    create(:board_member, board: @board, user: @member)
    second_card = create(:card, list: @list, title: "Write tests")

    patch move_api_v1_card_path(@card),
      params: { list_id: @list.id, position: 2 },
      headers: headers(@member),
      as: :json

    assert_response :success
    assert_equal [second_card, @card], @list.cards.to_a
  end

  def test_move_changes_list_membership_and_position
    second_card = create(:card, list: @list, title: "Write tests")
    destination_list = create(:list, board: @board, title: "Done")
    create(:card, list: destination_list, title: "Ship feature")

    patch move_api_v1_card_path(@card),
      params: { list_id: destination_list.id, position: 1 },
      headers: headers(@owner),
      as: :json

    assert_response :success
    assert_equal destination_list, @card.reload.list
    assert_equal 1, @card.position
    assert_equal [second_card], @list.cards.to_a
    assert_equal [@card, destination_list.cards.find_by!(title: "Ship feature")],
      destination_list.cards.to_a
    assert_equal I18n.t("successfully_updated", entity: "Card"), response_body["notice"]
  end

  def test_move_allows_board_member
    create(:board_member, board: @board, user: @member)
    destination_list = create(:list, board: @board, title: "Done")

    patch move_api_v1_card_path(@card),
      params: { list_id: destination_list.id, position: 1 },
      headers: headers(@member),
      as: :json

    assert_response :success
    assert_equal destination_list, @card.reload.list
  end

  def test_move_rejects_list_from_another_board
    other_board = create(:board, owner: @owner)
    other_list = create(:list, board: other_board, title: "Other")

    patch move_api_v1_card_path(@card),
      params: { list_id: other_list.id, position: 1 },
      headers: headers(@owner),
      as: :json

    assert_response :not_found
    assert_equal @list, @card.reload.list
  end

  def test_move_rejects_non_member
    destination_list = create(:list, board: @board, title: "Done")

    patch move_api_v1_card_path(@card),
      params: { list_id: destination_list.id, position: 1 },
      headers: headers(@other_user),
      as: :json

    assert_response :not_found
    assert_equal @list, @card.reload.list
  end

  def test_destroy_deletes_card_for_owner
    assert_difference -> { Card.count }, -1 do
      delete api_v1_card_path(@card), headers: headers(@owner), as: :json
    end

    assert_response :success
    assert_equal I18n.t("successfully_deleted", count: 1, entity: "Card"), response_body["notice"]
  end

  def test_destroy_allows_board_member
    create(:board_member, board: @board, user: @member)

    assert_difference -> { Card.count }, -1 do
      delete api_v1_card_path(@card), headers: headers(@member), as: :json
    end

    assert_response :success
  end

  def test_destroy_rejects_non_member
    assert_no_difference -> { Card.count } do
      delete api_v1_card_path(@card), headers: headers(@other_user), as: :json
    end

    assert_response :not_found
    assert Card.exists?(@card.id)
  end

  def test_show_includes_assignees
    create(:board_member, board: @board, user: @member)
    @card.update!(assignee_ids: [@member.id])

    get api_v1_card_path(@card), headers: headers(@owner), as: :json

    assert_response :success
    assert_equal 1, response_body["assignees"].size
    assert_equal @member.id, response_body["assignees"].first["id"]
    assert_equal @member.first_name, response_body["assignees"].first["first_name"]
    assert_equal @member.last_name, response_body["assignees"].first["last_name"]
    assert_equal @member.email, response_body["assignees"].first["email"]
  end

  def test_update_assigns_board_member_as_assignee
    create(:board_member, board: @board, user: @member)

    patch api_v1_card_path(@card),
      params: { card: { assignee_ids: [@member.id] } },
      headers: headers(@owner),
      as: :json

    assert_response :success
    assert_equal [@member], @card.reload.assignees.to_a
  end

  def test_update_assigns_multiple_board_members
    second_member = create(:user)
    create(:board_member, board: @board, user: @member)
    create(:board_member, board: @board, user: second_member)

    patch api_v1_card_path(@card),
      params: { card: { assignee_ids: [@member.id, second_member.id] } },
      headers: headers(@owner),
      as: :json

    assert_response :success
    assert_equal [@member.id, second_member.id].sort, @card.reload.assignee_ids.sort
  end

  def test_update_assigns_board_owner_as_assignee
    patch api_v1_card_path(@card),
      params: { card: { assignee_ids: [@owner.id] } },
      headers: headers(@owner),
      as: :json

    assert_response :success
    assert_equal [@owner], @card.reload.assignees.to_a
  end

  def test_update_allows_member_to_assign_assignee
    create(:board_member, board: @board, user: @member)

    patch api_v1_card_path(@card),
      params: { card: { assignee_ids: [@owner.id] } },
      headers: headers(@member),
      as: :json

    assert_response :success
    assert_equal [@owner], @card.reload.assignees.to_a
  end

  def test_update_rejects_non_board_member_as_assignee
    patch api_v1_card_path(@card),
      params: { card: { assignee_ids: [@other_user.id] } },
      headers: headers(@owner),
      as: :json

    assert_response :unprocessable_entity
    assert_equal "Assignees #{I18n.t('card.assignee.must_be_board_member')}", response_body["error"]
    assert_empty @card.reload.assignees
  end

  def test_update_clears_assignees
    create(:board_member, board: @board, user: @member)
    @card.update!(assignee_ids: [@member.id])

    patch api_v1_card_path(@card),
      params: { card: { assignee_ids: [] } },
      headers: headers(@owner),
      as: :json

    assert_response :success
    assert_empty @card.reload.assignees
  end
end
