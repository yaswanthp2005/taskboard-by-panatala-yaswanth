# frozen_string_literal: true

require "test_helper"

class BoardMemberTest < ActiveSupport::TestCase
  def setup
    @owner = create(:user)
    @member = create(:user)
    @board = create(:board, owner: @owner)
  end

  def test_is_valid
    board_member = build(:board_member, board: @board, user: @member)

    assert board_member.valid?
  end

  def test_is_invalid_with_duplicate_user_for_board
    create(:board_member, board: @board, user: @member)
    duplicate = build(:board_member, board: @board, user: @member)

    assert_not duplicate.valid?
    assert_includes duplicate.errors[:user_id], "has already been taken"
  end

  def test_cannot_add_board_owner_as_member
    board_member = build(:board_member, board: @board, user: @owner)

    assert_not board_member.valid?
    assert_includes board_member.errors[:user], I18n.t("board_member.owner_cannot_be_member")
  end

  def test_belongs_to_board_and_user
    board_member = create(:board_member, board: @board, user: @member)

    assert_equal @board, board_member.board
    assert_equal @member, board_member.user
  end
end
