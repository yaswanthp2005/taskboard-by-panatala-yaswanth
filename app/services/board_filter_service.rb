# frozen_string_literal: true

class BoardFilterService
  attr_reader :boards, :params

  def initialize(boards, params:)
    @boards = boards
    @params = params
  end

  def process
    filter_by_search
  end

  private

    def filter_by_search
      search = params[:search].to_s.strip
      return boards if search.blank?

      boards.where(
        "LOWER(boards.name) LIKE ?",
        "%#{Board.sanitize_sql_like(search.downcase)}%"
      )
    end
end
