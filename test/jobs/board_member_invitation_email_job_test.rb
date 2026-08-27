# frozen_string_literal: true

require "test_helper"

class BoardMemberInvitationEmailJobTest < ActiveSupport::TestCase
  include ActionMailer::TestHelper

  def setup
    @owner = create(:user)
    @invitee = create(:user, email: "invitee@example.com")
    @board = create(:board, owner: @owner)
    @invitation = create(:board_invitation, board: @board, inviter: @owner, invitee: @invitee)
  end

  def test_perform_delivers_invitation_email
    assert_emails 1 do
      BoardMemberInvitationEmailJob.new.perform(@invitation.id, @owner.id)
    end

    assert @invitation.reload.invitation_email_sent_at.present?
  end

  def test_perform_redelivers_email_while_invitation_is_pending
    @invitation.update!(invitation_email_sent_at: 1.day.ago)

    assert_emails 1 do
      BoardMemberInvitationEmailJob.new.perform(@invitation.id, @owner.id)
    end
  end

  def test_perform_skips_when_invitation_is_accepted
    @invitation.accepted!

    assert_emails 0 do
      BoardMemberInvitationEmailJob.new.perform(@invitation.id, @owner.id)
    end
  end

  def test_perform_raises_when_invitation_is_missing
    assert_raises(ActiveRecord::RecordNotFound) do
      BoardMemberInvitationEmailJob.new.perform(SecureRandom.uuid, @owner.id)
    end
  end
end
