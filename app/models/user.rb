# frozen_string_literal: true

class User < ApplicationRecord
  MAX_NAME_LENGTH = 255
  MAX_EMAIL_LENGTH = 255
  MIN_PASSWORD_LENGTH = 6
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i.freeze

  has_secure_password
  has_secure_token :authentication_token

  has_many :boards, foreign_key: :owner_id, dependent: :destroy, inverse_of: :owner

  validates :first_name, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :last_name, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :email, presence: true, uniqueness: true, length: { maximum: MAX_EMAIL_LENGTH },
    format: { with: VALID_EMAIL_REGEX }
  validates :password, presence: true, length: { minimum: MIN_PASSWORD_LENGTH }
  validates :password, confirmation: true

  before_save :downcase_email

  private

    def downcase_email
      email.downcase!
    end
end
