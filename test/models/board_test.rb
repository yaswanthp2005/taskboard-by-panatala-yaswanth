# frozen_string_literal: true

require "test_helper"

class BoardTest < ActiveSupport::TestCase
  def setup
    @owner = create(:user)
    @board = build(:board, owner: @owner)
  end

  def test_is_valid
    assert @board.valid?
  end

  def test_is_invalid_without_name
    @board.name = nil

    assert_not @board.valid?
    assert_includes @board.errors[:name], "can't be blank"
  end

  def test_is_invalid_without_owner
    @board.owner = nil

    assert_not @board.valid?
    assert_includes @board.errors[:owner], "must exist"
  end

  def test_belongs_to_owner
    assert_equal @owner, @board.owner
  end

  def test_has_no_members_on_create
    board = create(:board, owner: @owner)

    assert_empty board.members
  end
end
