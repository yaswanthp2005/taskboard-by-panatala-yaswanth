# frozen_string_literal: true

class BoardInvitationAcceptService
  class Error < StandardError; end

  attr_reader :token, :user

  def initialize(token:, user:)
    @token = token
    @user = user
  end

  def process!
    invitation = BoardInvitation.find_by(token:)
    raise Error, I18n.t("board_member.invitation_not_found") unless invitation

    validate_invitee!(invitation)

    if invitation.accepted?
      return invitation.board if invitation.board.members.exists?(id: invitation.invitee_id)

      raise Error, I18n.t("board_member.invitation_not_found")
    end

    raise Error, I18n.t("board_member.invitation_not_found") unless invitation.pending?

    BoardMember.transaction do
      invitation.board.board_members.create!(user: invitation.invitee)
      invitation.accepted!
      invitation.update!(accepted_at: Time.current)
    end

    invitation.board
  end

  private

    def validate_invitee!(invitation)
      return if invitation.invitee_id == user.id

      raise Error, I18n.t("board_member.invitation_invalid_recipient")
    end
end
