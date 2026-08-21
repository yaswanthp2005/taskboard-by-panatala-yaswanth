# frozen_string_literal: true

class Card < ApplicationRecord
  MAX_TITLE_LENGTH = 255

  belongs_to :list, inverse_of: :cards

  has_one :board, through: :list

  acts_as_list scope: :list, add_new_at: :bottom

  validates :title, presence: true, length: { maximum: MAX_TITLE_LENGTH }
end
