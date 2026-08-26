# frozen_string_literal: true

module Paginatable
  extend ActiveSupport::Concern

  PAGY_METADATA_KEYS = %i[
    count
    page
    limit
    last
    previous
    next
    previous_url
    next_url
  ].freeze

  private

    def paginate(collection)
      @pagy, paginated_collection = pagy(collection)
      @pagination = pagy_metadata(@pagy)
      paginated_collection
    end

    def pagy_metadata(pagy)
      pagy.data_hash(data_keys: PAGY_METADATA_KEYS)
    end
end
