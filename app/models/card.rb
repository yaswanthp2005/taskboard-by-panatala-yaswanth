# frozen_string_literal: true

class Card < ApplicationRecord
  MAX_TITLE_LENGTH = 255
  MAX_DESCRIPTION_LENGTH = 5000

  belongs_to :list, inverse_of: :cards

  has_one :board, through: :list

  acts_as_list scope: :list, add_new_at: :bottom

  validates :title, presence: true, length: { maximum: MAX_TITLE_LENGTH }
  validates :description, length: { maximum: MAX_DESCRIPTION_LENGTH }, allow_blank: true
end
