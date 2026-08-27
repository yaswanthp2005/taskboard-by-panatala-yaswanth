# frozen_string_literal: true

require "test_helper"

class BoardInviteServiceTest < ActiveSupport::TestCase
  def setup
    @owner = create(:user)
    @invitee = create(:user, email: "invitee@example.com")
    @board = create(:board, owner: @owner)
    @service = BoardInviteService.new(board: @board, inviter: @owner, email: @invitee.email)
  end

  def test_process_creates_pending_invitation_without_sending_email
    assert_difference -> { @board.board_invitations.count }, 1 do
      assert_no_difference -> { @board.board_members.count } do
        invitation = @service.process!

        assert invitation.pending?
        assert_equal @invitee.id, invitation.invitee_id
        assert_nil invitation.invitation_email_sent_at
      end
    end
  end

  def test_process_rejects_pending_invitation_for_same_user
    create(:board_invitation, board: @board, inviter: @owner, invitee: @invitee)

    assert_raises BoardInviteService::Error do
      @service.process!
    end
  end

  def test_process_rejects_non_owner_inviter
    service = BoardInviteService.new(board: @board, inviter: create(:user), email: @invitee.email)

    error = assert_raises(BoardInviteService::Error) { service.process! }

    assert_equal I18n.t("board_member.only_owner_can_invite"), error.message
  end
end
