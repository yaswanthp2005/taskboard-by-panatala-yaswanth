# frozen_string_literal: true

require "test_helper"

class BoardInvitationAcceptServiceTest < ActiveSupport::TestCase
  def setup
    @owner = create(:user)
    @invitee = create(:user, email: "invitee@example.com")
    @other_user = create(:user)
    @board = create(:board, owner: @owner)
    @invitation = create(:board_invitation, board: @board, inviter: @owner, invitee: @invitee)
  end

  def test_process_creates_board_member_and_marks_invitation_accepted
    service = BoardInvitationAcceptService.new(token: @invitation.token, user: @invitee)

    assert_difference -> { @board.board_members.count }, 1 do
      board = service.process!

      assert_equal @board, board
    end

    @invitation.reload
    assert @invitation.accepted?
    assert @board.members.exists?(id: @invitee.id)
  end

  def test_process_is_idempotent_for_accepted_invitation
    service = BoardInvitationAcceptService.new(token: @invitation.token, user: @invitee)
    service.process!

    assert_no_difference -> { @board.board_members.count } do
      board = service.process!

      assert_equal @board, board
    end
  end

  def test_process_rejects_wrong_user
    service = BoardInvitationAcceptService.new(token: @invitation.token, user: @other_user)

    assert_raises BoardInvitationAcceptService::Error do
      service.process!
    end
  end

  def test_process_accepts_only_the_invitation_for_the_given_token
    other_owner = create(:user)
    other_board = create(:board, owner: other_owner)
    other_invitation = create(:board_invitation, board: other_board, inviter: other_owner, invitee: @invitee)

    BoardInvitationAcceptService.new(token: @invitation.token, user: @invitee).process!

    assert @board.members.exists?(id: @invitee.id)
    assert_not other_board.members.exists?(id: @invitee.id)
    assert @invitation.reload.accepted?
    assert other_invitation.reload.pending?
  end
end
