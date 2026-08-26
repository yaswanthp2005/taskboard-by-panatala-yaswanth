# frozen_string_literal: true

require "test_helper"

class CardTest < ActiveSupport::TestCase
  def setup
    @owner = create(:user)
    @board = create(:board, owner: @owner)
    @list = create(:list, board: @board, title: "To Do")
  end

  def test_is_valid
    card = build(:card, list: @list)

    assert card.valid?
  end

  def test_is_invalid_without_title
    card = build(:card, list: @list, title: nil)

    assert_not card.valid?
    assert_includes card.errors[:title], "can't be blank"
  end

  def test_is_invalid_when_description_exceeds_max_length
    card = build(:card, list: @list, description: "a" * (Card::MAX_DESCRIPTION_LENGTH + 1))

    assert_not card.valid?
    assert_includes card.errors[:description], "is too long (maximum is #{Card::MAX_DESCRIPTION_LENGTH} characters)"
  end

  def test_allows_blank_description_and_due_date
    card = build(:card, list: @list, description: nil, due_date: nil)

    assert card.valid?
  end

  def test_accepts_description_and_due_date
    card = create(:card, list: @list, description: "Add login flow", due_date: Date.new(2026, 8, 25))

    assert_equal "Add login flow", card.description
    assert_equal Date.new(2026, 8, 25), card.due_date
  end

  def test_belongs_to_list
    card = create(:card, list: @list)

    assert_equal @list, card.list
  end

  def test_new_card_is_assigned_last_position_in_list
    first_card = create(:card, title: "First card", list: @list)
    second_card = create(:card, title: "Second card", list: @list)
    third_card = create(:card, title: "Third card", list: @list)

    assert_equal 1, first_card.position
    assert_equal 2, second_card.position
    assert_equal 3, third_card.position
  end

  def test_insert_at_updates_positions_within_list
    first_card = create(:card, title: "First card", list: @list)
    second_card = create(:card, title: "Second card", list: @list)
    third_card = create(:card, title: "Third card", list: @list)

    third_card.insert_at(1)

    assert_equal [third_card, first_card, second_card], @list.cards.to_a
    assert_equal [1, 2, 3], @list.cards.pluck(:position)
  end

  def test_destroying_list_destroys_cards
    create(:card, list: @list)

    assert_difference "Card.count", -1 do
      @list.destroy
    end
  end

  def test_can_attach_labels_from_same_board
    bug_label = create(:label, board: @board, name: "Bug")
    feature_label = create(:label, board: @board, name: "Feature")
    card = create(:card, list: @list)

    card.update!(label_ids: [bug_label.id, feature_label.id])

    assert_equal [bug_label.id, feature_label.id].sort, card.labels.pluck(:id).sort
  end

  def test_rejects_labels_from_other_board
    other_board = create(:board, owner: @owner)
    other_label = create(:label, board: other_board, name: "Other")
    card = build(:card, list: @list)
    card.label_ids = [other_label.id]

    assert_not card.valid?
    assert_includes card.errors[:labels], I18n.t("card.labels.must_belong_to_board")
  end

  def test_can_detach_labels
    bug_label = create(:label, board: @board, name: "Bug")
    card = create(:card, list: @list, label_ids: [bug_label.id])

    card.update!(label_ids: [])

    assert_empty card.reload.labels
  end

  def test_can_assign_board_member_as_assignee
    member = create(:user)
    create(:board_member, board: @board, user: member)
    card = create(:card, list: @list)

    card.update!(assignee_ids: [member.id])

    assert_equal [member], card.reload.assignees.to_a
  end

  def test_can_assign_multiple_board_members
    member = create(:user)
    second_member = create(:user)
    create(:board_member, board: @board, user: member)
    create(:board_member, board: @board, user: second_member)
    card = create(:card, list: @list)

    card.update!(assignee_ids: [member.id, second_member.id])

    assert_equal [member.id, second_member.id].sort, card.reload.assignee_ids.sort
  end

  def test_can_assign_board_owner_as_assignee
    card = create(:card, list: @list)

    card.update!(assignee_ids: [@owner.id])

    assert_equal [@owner], card.reload.assignees.to_a
  end

  def test_rejects_non_board_member_as_assignee
    other_user = create(:user)
    card = build(:card, list: @list)
    card.assignee_ids = [other_user.id]

    assert_not card.valid?
    assert_includes card.errors[:assignees], I18n.t("card.assignee.must_be_board_member")
  end

  def test_defaults_is_complete_to_false
    card = create(:card, list: @list)

    assert_not card.is_complete
  end

  def test_can_mark_is_complete
    card = create(:card, list: @list, is_complete: true)

    assert card.is_complete
  end

  def test_allows_blank_assignees
    card = build(:card, list: @list)

    assert card.valid?
  end
end
