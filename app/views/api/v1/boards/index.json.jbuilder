# frozen_string_literal: true

json.boards do
  json.array! @boards do |board|
    json.partial! "board", board: board
  end
end

json.pagination @pagination
