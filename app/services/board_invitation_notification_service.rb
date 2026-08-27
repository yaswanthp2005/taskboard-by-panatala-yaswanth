# frozen_string_literal: true

class BoardInvitationNotificationService
  attr_reader :user

  def initialize(user:)
    @user = user
  end

  def process!
    pending_invitations = user.received_board_invitations.pending.order(:created_at)
    deliver_pending_emails(pending_invitations)
    pending_invitations.first&.token
  end

  private

    def deliver_pending_emails(pending_invitations)
      pending_invitations.each do |invitation|
        BoardMemberInvitationEmailJob.new.perform(invitation.id, invitation.inviter_id)
      end
    end
end
