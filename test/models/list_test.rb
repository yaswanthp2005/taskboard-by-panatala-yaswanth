# frozen_string_literal: true

require "test_helper"

class ListTest < ActiveSupport::TestCase
  def setup
    @owner = create(:user)
    @board = create(:board, owner: @owner)
  end

  def test_is_valid
    list = build(:list, board: @board)

    assert list.valid?
  end

  def test_is_invalid_without_title
    list = build(:list, board: @board, title: nil)

    assert_not list.valid?
    assert_includes list.errors[:title], "can't be blank"
  end

  def test_belongs_to_board
    list = create(:list, board: @board)

    assert_equal @board, list.board
  end

  def test_new_list_is_assigned_last_position_in_board
    first_list = create(:list, title: "To Do", board: @board)
    second_list = create(:list, title: "In Progress", board: @board)
    third_list = create(:list, title: "Done", board: @board)

    assert_equal 1, first_list.position
    assert_equal 2, second_list.position
    assert_equal 3, third_list.position
  end

  def test_insert_at_updates_positions_within_board
    first_list = create(:list, title: "To Do", board: @board)
    second_list = create(:list, title: "In Progress", board: @board)
    third_list = create(:list, title: "Done", board: @board)

    third_list.insert_at(1)

    assert_equal [third_list, first_list, second_list], @board.lists.to_a
    assert_equal [1, 2, 3], @board.lists.pluck(:position)
  end

  def test_reordering_in_one_board_does_not_affect_other_board
    first_list = create(:list, title: "To Do", board: @board)
    second_list = create(:list, title: "In Progress", board: @board)
    other_board = create(:board, owner: @owner)
    other_first_list = create(:list, title: "To Do", board: other_board)
    other_second_list = create(:list, title: "In Progress", board: other_board)

    second_list.insert_at(1)

    assert_equal [second_list, first_list], @board.lists.to_a
    assert_equal [other_first_list, other_second_list], other_board.lists.to_a
    assert_equal [1, 2], other_board.lists.pluck(:position)
  end

  def test_destroying_board_destroys_lists
    create(:list, board: @board)

    assert_difference "List.count", -1 do
      @board.destroy
    end
  end
end
