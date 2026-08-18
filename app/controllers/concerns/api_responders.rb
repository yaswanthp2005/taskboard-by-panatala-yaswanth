# frozen_string_literal: true

module ApiResponders
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

    def pagy_metadata(pagy)
      pagy.data_hash(data_keys: PAGY_METADATA_KEYS)
    end

    def render_error(message, status = :unprocessable_entity, context = {})
      is_exception = message.is_a?(StandardError)
      error_message = is_exception ? message.record&.errors_to_sentence : message
      render status:, json: { error: error_message }.merge(context)
    end

    def render_notice(message, status = :ok, context = {})
      render status:, json: { notice: message }.merge(context)
    end

    def render_json(json = {}, status = :ok)
      render status:, json:
    end
end
