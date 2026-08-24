# frozen_string_literal: true

class Card < ApplicationRecord
  MAX_TITLE_LENGTH = 255
  MAX_DESCRIPTION_LENGTH = 5000

  belongs_to :list, inverse_of: :cards

  has_one :board, through: :list

  has_many :card_labels, dependent: :destroy
  has_many :labels, through: :card_labels
  has_many :card_assignees, dependent: :destroy
  has_many :assignees, -> { order(:first_name, :last_name) }, through: :card_assignees, source: :user
  has_many :checklist_items, -> { order(:created_at) }, dependent: :destroy, inverse_of: :card
  has_many :activities, dependent: :nullify

  acts_as_list scope: :list, add_new_at: :bottom

  validates :title, presence: true, length: { maximum: MAX_TITLE_LENGTH }
  validates :description, length: { maximum: MAX_DESCRIPTION_LENGTH }, allow_blank: true
  validate :labels_must_belong_to_board
  validate :assignees_must_belong_to_board

  private

    def assignees_must_belong_to_board
      return if assignee_ids.blank?

      board_user_ids = (board.member_ids + [board.owner_id]).map(&:to_s)
      invalid_assignee_ids = assignee_ids.map(&:to_s) - board_user_ids
      return if invalid_assignee_ids.empty?

      errors.add(:assignees, I18n.t("card.assignee.must_be_board_member"))
    end

    def labels_must_belong_to_board
      return if label_ids.blank?

      invalid_label_ids = label_ids.map(&:to_s) - board.label_ids.map(&:to_s)
      return if invalid_label_ids.empty?

      errors.add(:labels, I18n.t("card.labels.must_belong_to_board"))
    end
end
