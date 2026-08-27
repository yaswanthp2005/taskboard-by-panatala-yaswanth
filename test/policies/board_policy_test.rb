# frozen_string_literal: true

require "test_helper"

class BoardPolicyTest < ActiveSupport::TestCase
  def setup
    @owner = create(:user)
    @member = create(:user)
    @other_user = create(:user)
    @board = create(:board, owner: @owner)
    create(:board_member, board: @board, user: @member)
  end

  def test_index_is_allowed_for_signed_in_user
    policy = BoardPolicy.new(@owner, Board)

    assert policy.index?
  end

  def test_index_is_denied_for_guest
    policy = BoardPolicy.new(nil, Board)

    assert_not policy.index?
  end

  def test_create_is_allowed_for_owner
    policy = BoardPolicy.new(@owner, @board)

    assert policy.create?
  end

  def test_create_is_denied_for_member
    policy = BoardPolicy.new(@member, @board)

    assert_not policy.create?
  end

  def test_update_and_destroy_are_owner_only
    owner_policy = BoardPolicy.new(@owner, @board)
    member_policy = BoardPolicy.new(@member, @board)

    assert owner_policy.update?
    assert owner_policy.destroy?
    assert_not member_policy.update?
    assert_not member_policy.destroy?
  end

  def test_scope_returns_owned_and_shared_boards
    shared_board = create(:board, owner: create(:user))
    create(:board_member, board: shared_board, user: @member)
    unrelated_board = create(:board, owner: create(:user))

    resolved_ids = BoardPolicy::Scope.new(@member, Board.all).resolve.pluck(:id)

    assert_includes resolved_ids, @board.id
    assert_includes resolved_ids, shared_board.id
    assert_not_includes resolved_ids, unrelated_board.id
  end

  def test_scope_returns_none_for_guest
    resolved = BoardPolicy::Scope.new(nil, Board.all).resolve

    assert_empty resolved
  end
end
