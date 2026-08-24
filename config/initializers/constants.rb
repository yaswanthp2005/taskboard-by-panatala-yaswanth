# frozen_string_literal: true

module Constants
  module Activity
    CARD_CREATED = "card_created"
    CARD_UPDATED = "card_updated"
    CARD_MOVED = "card_moved"
    CARD_DELETED = "card_deleted"
    LIST_CREATED = "list_created"
    LIST_UPDATED = "list_updated"
    LIST_DELETED = "list_deleted"

    ACTIONS = [
      CARD_CREATED,
      CARD_UPDATED,
      CARD_MOVED,
      CARD_DELETED,
      LIST_CREATED,
      LIST_UPDATED,
      LIST_DELETED
    ].freeze
  end
end
