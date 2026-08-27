# frozen_string_literal: true

class BoardInviteService
  class Error < StandardError; end

  attr_reader :board, :inviter, :email

  def initialize(board:, inviter:, email:)
    @board = board
    @inviter = inviter
    @email = email.to_s.strip.downcase
  end

  def process!
    validate_inviter_is_owner!
    validate_email_present!

    invitee = find_registered_user!
    validate_not_owner!(invitee)
    validate_not_existing_member!(invitee)
    validate_no_pending_invitation!(invitee)

    invitation = board.board_invitations.create!(inviter:, invitee:)
  end

  private

    def validate_inviter_is_owner!
      return if board.owner_id == inviter.id

      raise Error, I18n.t("board_member.only_owner_can_invite")
    end

    def validate_email_present!
      return if email.present?

      raise Error, I18n.t("board_member.email_required")
    end

    def find_registered_user!
      user = User.find_by("LOWER(email) = ?", email)
      return user if user.present?

      raise Error, I18n.t("board_member.user_not_registered")
    end

    def validate_not_owner!(invitee)
      return unless invitee.id == board.owner_id

      raise Error, I18n.t("board_member.owner_already_on_board")
    end

    def validate_not_existing_member!(invitee)
      return unless board.members.exists?(id: invitee.id)

      raise Error, I18n.t("board_member.already_member")
    end

    def validate_no_pending_invitation!(invitee)
      return unless board.board_invitations.pending.exists?(invitee_id: invitee.id)

      raise Error, I18n.t("board_member.invitation_already_sent")
    end
end
