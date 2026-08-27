# frozen_string_literal: true

require "test_helper"

class BoardInvitationNotificationServiceTest < ActiveSupport::TestCase
  include ActionMailer::TestHelper

  def setup
    @owner = create(:user)
    @invitee = create(:user, email: "invitee@example.com")
    @board = create(:board, owner: @owner)
    @invitation = create(:board_invitation, board: @board, inviter: @owner, invitee: @invitee)
    @service = BoardInvitationNotificationService.new(user: @invitee)
  end

  def test_process_delivers_pending_invitation_email
    assert_emails 1 do
      token = @service.process!

      assert_equal @invitation.token, token
    end

    assert @invitation.reload.invitation_email_sent_at.present?
  end

  def test_process_redelivers_email_on_login_while_invitation_is_pending
    @invitation.update!(invitation_email_sent_at: 1.day.ago)

    assert_emails 1 do
      token = @service.process!

      assert_equal @invitation.token, token
    end
  end

  def test_process_returns_nil_when_no_pending_invitations
    @invitation.update!(status: :accepted)

    assert_emails 0 do
      assert_nil BoardInvitationNotificationService.new(user: @invitee).process!
    end
  end
end
