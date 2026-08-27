# frozen_string_literal: true

module ApiResponders
  extend ActiveSupport::Concern

  private

    def render_error(message, status = :unprocessable_entity, context = {})
      error_message = case message
                      when ActiveRecord::RecordInvalid
                        message.record.errors_to_sentence
                      when StandardError
                        message.message
                      else
                        message
      end

      render status:, json: { error: error_message }.merge(context)
    end

    def render_notice(message, status = :ok, context = {})
      render status:, json: { notice: message }.merge(context)
    end

    def render_json(json = {}, status = :ok)
      render status:, json:
    end
end
