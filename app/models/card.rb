# frozen_string_literal: true

class Card < ApplicationRecord
  MAX_TITLE_LENGTH = 255

  belongs_to :board

  validates :title, presence: true, length: { maximum: MAX_TITLE_LENGTH }
end
