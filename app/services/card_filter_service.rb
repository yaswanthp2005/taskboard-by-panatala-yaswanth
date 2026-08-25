# frozen_string_literal: true

class CardFilterService
  attr_reader :cards, :params

  def initialize(cards, params:)
    @cards = cards
    @params = params
  end

  def process
    filter_by_search
  end

  private

    def filter_by_search
      search = params[:search].to_s.strip
      return cards if search.blank?

      cards.where(
        "LOWER(cards.title) LIKE ?",
        "%#{Card.sanitize_sql_like(search.downcase)}%"
      )
    end
end
