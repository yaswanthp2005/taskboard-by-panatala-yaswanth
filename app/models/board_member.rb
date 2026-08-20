# frozen_string_literal: true

class BoardMember < ApplicationRecord
  belongs_to :board
  belongs_to :user

  validates :user_id, uniqueness: { scope: :board_id }
  validate :user_cannot_be_board_owner

  private

    def user_cannot_be_board_owner
      return if user_id.blank? || board.blank?
      return if user_id != board.owner_id

      errors.add(:user, I18n.t("board_member.owner_cannot_be_member"))
    end
end
