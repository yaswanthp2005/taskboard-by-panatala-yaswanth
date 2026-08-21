# frozen_string_literal: true

class List < ApplicationRecord
  MAX_TITLE_LENGTH = 255

  belongs_to :board, inverse_of: :lists

  has_many :cards, -> { order(:position) }, dependent: :destroy, inverse_of: :list

  acts_as_list scope: :board, add_new_at: :bottom

  validates :title, presence: true, length: { maximum: MAX_TITLE_LENGTH }
end
