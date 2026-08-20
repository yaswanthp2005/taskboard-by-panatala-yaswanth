# frozen_string_literal: true

class Board < ApplicationRecord
  MAX_NAME_LENGTH = 255
  MAX_DESCRIPTION_LENGTH = 1000

  belongs_to :owner, class_name: "User", inverse_of: :boards

  validates :name, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :description, length: { maximum: MAX_DESCRIPTION_LENGTH }, allow_blank: true
end
