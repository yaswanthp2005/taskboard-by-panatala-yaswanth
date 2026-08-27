# frozen_string_literal: true

class BoardInvitation < ApplicationRecord
  enum :status, { pending: "pending", accepted: "accepted" }, default: :pending

  belongs_to :board
  belongs_to :inviter, class_name: "User"
  belongs_to :invitee, class_name: "User"

  has_secure_token :token

  validates :invitee_id, uniqueness: { scope: :board_id }
end
