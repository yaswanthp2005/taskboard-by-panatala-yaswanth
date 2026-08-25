# frozen_string_literal: true

class CardFilterService
  DUE_STATUS_OVERDUE = "overdue"
  DUE_STATUS_DUE_SOON = "due_soon"
  DUE_STATUS_NO_DUE_DATE = "no_due_date"
  DUE_SOON_DAYS = 7

  attr_reader :cards, :params

  def initialize(cards, params:)
    @cards = cards
    @params = params
  end

  def process
    filter_by_search
    filter_by_assignee
    filter_by_label
    filter_by_due_status

    @cards
  end

  private

    def filter_by_search
      search = params[:search].to_s.strip.downcase
      return if search.blank?

      @cards = cards.where(
        "LOWER(cards.title) LIKE ?",
        "%#{Card.sanitize_sql_like(search)}%"
      )
    end

    def filter_by_assignee
      names = names_from_params(:assignees)
      return if names.blank?

      @cards = cards.joins(:assignees).where(
        "LOWER(TRIM(CONCAT_WS(' ', users.first_name, users.last_name))) IN (?)",
        names
      )
    end

    def filter_by_label
      names = names_from_params(:labels)
      return if names.blank?

      @cards = cards.joins(:labels).where(
        "LOWER(labels.name) IN (?)",
        names
      )
    end

    def filter_by_due_status
      case params[:due_status].to_s.strip
      when DUE_STATUS_OVERDUE
        @cards = cards.where("cards.due_date < ?", Date.current)

      when DUE_STATUS_DUE_SOON
        @cards = cards.where(
          due_date: Date.current..(Date.current + DUE_SOON_DAYS.days)
        )

      when DUE_STATUS_NO_DUE_DATE
        @cards = cards.where(due_date: nil)
      end
    end

    def names_from_params(key)
      Array(params[key])
        .flat_map { |value| value.to_s.split(",") }
        .map { |value| value.strip.downcase }
        .reject(&:blank?)
    end
end
