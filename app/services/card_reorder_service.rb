# frozen_string_literal: true

class CardReorderService
  def initialize(list:, card_ids:)
    @list = list
    @card_ids = Array(card_ids).filter_map(&:presence)
  end

  def process
    cards = load_cards_for_reorder
    apply_card_order!(cards)
  end

  private

    def load_cards_for_reorder
      list_cards = Card.where(list_id: @list.id)

      if @card_ids.uniq.size != @card_ids.size
        raise ArgumentError, I18n.t("card.reorder.invalid")
      end

      if @card_ids.size != list_cards.count
        raise ArgumentError, I18n.t("card.reorder.incomplete")
      end

      @card_ids.map { |card_id| list_cards.find(card_id) }
    end

    def apply_card_order!(cards)
      ActiveRecord::Base.transaction do
        cards.each_with_index do |card, index|
          card.insert_at(index + 1)
        end
      end
    end
end
