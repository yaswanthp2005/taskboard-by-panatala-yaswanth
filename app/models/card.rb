# frozen_string_literal: true

class Card < ApplicationRecord
  MAX_TITLE_LENGTH = 255
  MAX_DESCRIPTION_LENGTH = 5000

  belongs_to :list, inverse_of: :cards

  has_one :board, through: :list

  has_many :card_labels, dependent: :destroy
  has_many :labels, through: :card_labels
  has_many :checklist_items, -> { order(:created_at) }, dependent: :destroy, inverse_of: :card

  acts_as_list scope: :list, add_new_at: :bottom

  validates :title, presence: true, length: { maximum: MAX_TITLE_LENGTH }
  validates :description, length: { maximum: MAX_DESCRIPTION_LENGTH }, allow_blank: true
  validate :labels_must_belong_to_board

  private

    def labels_must_belong_to_board
      return if label_ids.blank?

      invalid_label_ids = label_ids.map(&:to_s) - board.label_ids.map(&:to_s)
      return if invalid_label_ids.empty?

      errors.add(:labels, I18n.t("card.labels.must_belong_to_board"))
    end
end
