# frozen_string_literal: true

class BoardMemberInvitationEmailJob
  include Sidekiq::Job

  def perform(invitation_id, inviter_id)
    invitation = BoardInvitation.find(invitation_id)
    return unless invitation&.pending?

    Mailer.board_member_invitation_email(invitation_id, inviter_id).deliver_now
  end
end
