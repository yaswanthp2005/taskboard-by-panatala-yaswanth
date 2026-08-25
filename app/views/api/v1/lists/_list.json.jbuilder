# frozen_string_literal: true

json.extract! list, :id, :title, :position, :created_at, :updated_at
json.cards local_assigns.fetch(:cards, list.cards) do |card|
  json.partial! "api/v1/cards/card", card: card
end
