# frozen_string_literal: true

class Board < ApplicationRecord
  MAX_NAME_LENGTH = 255
  MAX_DESCRIPTION_LENGTH = 1000
  DB_REGEX_OPERATOR = "~*"

  belongs_to :owner, class_name: "User", inverse_of: :boards

  has_many :board_members, dependent: :destroy
  has_many :members, through: :board_members, source: :user
  has_many :lists, -> { order(:position) }, dependent: :destroy, inverse_of: :board
  has_many :labels, -> { order(:name) }, dependent: :destroy, inverse_of: :board
  has_many :cards, through: :lists
  has_many :activities, dependent: :destroy

  validates :name, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :description, length: { maximum: MAX_DESCRIPTION_LENGTH }, allow_blank: true
  validates :slug, uniqueness: true
  validate :slug_not_changed

  before_create :set_slug

  private

    def set_slug
      name_slug = name.parameterize
      regex_pattern = "slug #{DB_REGEX_OPERATOR} ?"
      latest_board_slug = Board.where(
        regex_pattern,
        "^#{name_slug}$|^#{name_slug}-[0-9]+$"
      ).order("LENGTH(slug) DESC", slug: :desc).first&.slug
      slug_count = 0
      if latest_board_slug.present?
        slug_count = latest_board_slug.split("-").last.to_i
        only_one_slug_exists = slug_count == 0
        slug_count = 1 if only_one_slug_exists
      end

      self.slug = slug_count.positive? ? "#{name_slug}-#{slug_count + 1}" : name_slug
    end

    def slug_not_changed
      return unless will_save_change_to_slug? && persisted?

      errors.add(:slug, I18n.t("board.slug.immutable"))
    end
end
