# frozen_string_literal: true

class ChecklistItem < ApplicationRecord
  MAX_TEXT_LENGTH = 500

  belongs_to :card, inverse_of: :checklist_items

  validates :text, presence: true, length: { maximum: MAX_TEXT_LENGTH }
end
