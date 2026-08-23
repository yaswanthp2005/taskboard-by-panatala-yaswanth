# frozen_string_literal: true

require "test_helper"

class LabelTest < ActiveSupport::TestCase
  def setup
    @owner = create(:user)
    @board = create(:board, owner: @owner)
  end

  def test_is_valid
    label = build(:label, board: @board)

    assert label.valid?
  end

  def test_is_invalid_without_name
    label = build(:label, board: @board, name: nil)

    assert_not label.valid?
    assert_includes label.errors[:name], "can't be blank"
  end

  def test_is_invalid_without_color
    label = build(:label, board: @board, color: nil)

    assert_not label.valid?
    assert_includes label.errors[:color], "can't be blank"
  end

  def test_rejects_duplicate_name_on_same_board
    create(:label, board: @board, name: "Bug")
    duplicate_label = build(:label, board: @board, name: "bug")

    assert_not duplicate_label.valid?
    assert_includes duplicate_label.errors[:name], "has already been taken"
  end

  def test_allows_same_name_on_different_boards
    other_board = create(:board, owner: @owner)
    create(:label, board: @board, name: "Bug")
    label = build(:label, board: other_board, name: "Bug")

    assert label.valid?
  end

  def test_belongs_to_board
    label = create(:label, board: @board)

    assert_equal @board, label.board
  end

  def test_destroying_board_destroys_labels
    create(:label, board: @board)

    assert_difference "Label.count", -1 do
      @board.destroy
    end
  end
end
