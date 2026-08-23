# frozen_string_literal: true

class Label < ApplicationRecord
  MAX_NAME_LENGTH = 50
  MAX_COLOR_LENGTH = 7

  belongs_to :board, inverse_of: :labels

  has_many :card_labels, dependent: :destroy
  has_many :cards, through: :card_labels

  validates :name, presence: true, length: { maximum: MAX_NAME_LENGTH },
    uniqueness: { scope: :board_id, case_sensitive: false }
  validates :color, presence: true, length: { maximum: MAX_COLOR_LENGTH }
end
