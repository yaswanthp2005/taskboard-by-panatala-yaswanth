# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/mailer
class MailerPreview < ActionMailer::Preview
  def board_member_invitation_email
    invitation = BoardInvitation.includes(:board, :invitee, :inviter).first
    return unless invitation

    Mailer.with(preview: true).board_member_invitation_email(invitation.id, invitation.inviter_id)
  end
end
