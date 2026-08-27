# frozen_string_literal: true

class Mailer < ActionMailer::Base
  helper ApplicationHelper

  layout "mailer"

  default from: Rails.application.secrets.mailer_default_from_email

  default_url_options[:host] = Rails.application.secrets.host

  after_action :mark_invitation_email_sent, if: -> { @invitation && !params&.[](:preview) }

  def board_member_invitation_email(invitation_id, inviter_id)
    @invitation = BoardInvitation.includes(:board, :invitee).find(invitation_id)
    @inviter = User.find(inviter_id)
    return unless @invitation && @inviter

    @board = @invitation.board
    @invitee = @invitation.invitee
    @accept_url = "#{Rails.application.secrets.host}/invitations/#{@invitation.token}"

    mail(
      to: @invitee.email,
      subject: I18n.t(
        "board_member.invitation_email.subject",
        board_name: @board.name,
        inviter_name: view_context.full_name(@inviter)
      )
    )
  end

  private

    def mark_invitation_email_sent
      @invitation.update!(invitation_email_sent_at: Time.current)
    end
end
