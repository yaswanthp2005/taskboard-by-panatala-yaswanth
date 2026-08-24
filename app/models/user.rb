# frozen_string_literal: true

class User < ApplicationRecord
  MAX_NAME_LENGTH = 255
  MAX_EMAIL_LENGTH = 255
  MIN_PASSWORD_LENGTH = 6
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i.freeze

  has_secure_password
  has_secure_token :authentication_token

  has_many :boards, foreign_key: :owner_id, dependent: :destroy, inverse_of: :owner
  has_many :board_members, dependent: :destroy
  has_many :member_boards, through: :board_members, source: :board
  has_many :card_assignees, dependent: :destroy
  has_many :assigned_cards, through: :card_assignees, source: :card

  validates :first_name, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :last_name, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :email, presence: true, uniqueness: true, length: { maximum: MAX_EMAIL_LENGTH },
    format: { with: VALID_EMAIL_REGEX }
  validates :password, length: { minimum: MIN_PASSWORD_LENGTH }, if: -> { password.present? }
  validates :password, confirmation: true, if: -> { password.present? }

  before_save :downcase_email

  private

    def downcase_email
      email.downcase!
    end
end
