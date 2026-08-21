# frozen_string_literal: true

json.partial! "api/v1/boards/board", board: @board
json.lists @board.lists do |list|
  json.partial! "api/v1/lists/list", list: list
end
