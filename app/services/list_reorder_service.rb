# frozen_string_literal: true

class ListReorderService
  def initialize(board:, list_ids:)
    @board = board
    @list_ids = Array(list_ids).filter_map(&:presence)
  end

  def process
    lists = load_lists_for_reorder
    apply_list_order!(lists)
  end

  private

    def load_lists_for_reorder
      board_lists = List.where(board_id: @board.id)

      if @list_ids.uniq.size != @list_ids.size
        raise ArgumentError, I18n.t("list.reorder.invalid")
      end

      if @list_ids.size != board_lists.count
        raise ArgumentError, I18n.t("list.reorder.incomplete")
      end

      @list_ids.map { |list_id| board_lists.find(list_id) }
    end

    def apply_list_order!(lists)
      ActiveRecord::Base.transaction do
        lists.each_with_index do |list, index|
          list.insert_at(index + 1)
        end
      end
    end
end
