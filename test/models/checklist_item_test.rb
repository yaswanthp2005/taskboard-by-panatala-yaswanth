# frozen_string_literal: true

require "test_helper"

class ChecklistItemTest < ActiveSupport::TestCase
  def setup
    @owner = create(:user)
    @board = create(:board, owner: @owner)
    @list = create(:list, board: @board, title: "To Do")
    @card = create(:card, list: @list, title: "Fix login bug")
  end

  def test_is_valid
    item = build(:checklist_item, card: @card)

    assert item.valid?
  end

  def test_is_invalid_without_text
    item = build(:checklist_item, card: @card, text: nil)

    assert_not item.valid?
    assert_includes item.errors[:text], "can't be blank"
  end

  def test_belongs_to_card
    item = create(:checklist_item, card: @card, text: "Write tests")

    assert_equal @card, item.card
  end

  def test_defaults_is_complete_to_false
    item = create(:checklist_item, card: @card)

    assert_not item.is_complete
  end

  def test_can_mark_is_complete
    item = create(:checklist_item, card: @card, is_complete: true)

    assert item.is_complete
  end

  def test_destroying_card_destroys_checklist_items
    create(:checklist_item, card: @card)

    assert_difference "ChecklistItem.count", -1 do
      @card.destroy
    end
  end
end
