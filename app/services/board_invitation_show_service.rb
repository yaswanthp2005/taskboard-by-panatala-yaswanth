# frozen_string_literal: true

class BoardInvitationShowService
  class Error < StandardError; end

  attr_reader :token, :user

  def initialize(token:, user:)
    @token = token
    @user = user
  end

  def process!
    invitation = BoardInvitation.pending.find_by(token:)
    raise Error, I18n.t("board_member.invitation_not_found") unless invitation

    validate_invitee!(invitation)
    invitation
  end

  private

    def validate_invitee!(invitation)
      return if invitation.invitee_id == user.id

      raise Error, I18n.t("board_member.invitation_invalid_recipient")
    end
end
