# frozen_string_literal: true

json.lists @board.lists do |list|
  cards = if @filtered_card_ids
    list.cards.select { |card| @filtered_card_ids.include?(card.id) }
  else
    list.cards
  end

  json.partial! "api/v1/lists/list", list: list, cards: cards
end
