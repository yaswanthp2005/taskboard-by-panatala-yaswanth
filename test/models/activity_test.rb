# frozen_string_literal: true

require "test_helper"

class ActivityTest < ActiveSupport::TestCase
  def setup
    @owner = create(:user)
    @board = create(:board, owner: @owner)
    @list = create(:list, board: @board, title: "To Do")
    @card = create(:card, list: @list, title: "Fix login bug")
  end

  def test_is_valid_with_required_attributes
    activity = build(:activity, board: @board, actor: @owner, card: @card)

    assert activity.valid?
  end

  def test_is_invalid_without_action
    activity = build(:activity, board: @board, actor: @owner, card: @card, action: nil)

    assert_not activity.valid?
    assert_includes activity.errors[:action], "can't be blank"
  end

  def test_is_invalid_with_unknown_action
    activity = build(:activity, board: @board, actor: @owner, card: @card, action: "unknown_action")

    assert_not activity.valid?
    assert_includes activity.errors[:action], "is not included in the list"
  end

  def test_belongs_to_board_card_and_actor
    activity = create(:activity, board: @board, actor: @owner, card: @card, action: Constants::Activity::CARD_UPDATED)

    assert_equal @board, activity.board
    assert_equal @card, activity.card
    assert_equal @owner, activity.actor
  end

  def test_allows_board_level_activity_without_card
    activity = create(
      :activity,
      board: @board,
      actor: @owner,
      card: nil,
      action: Constants::Activity::LIST_CREATED,
      metadata: { list_title: "Done" }
    )

    assert_nil activity.card
    assert activity.persisted?
  end
end
