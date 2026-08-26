# frozen_string_literal: true

module ActivityRecordable
  extend ActiveSupport::Concern

  private

    def record_activity!(board:, action:, metadata: {}, card: nil)
      ActivityRecorderService.new(
        board:,
        actor: current_user,
        action:,
        card:,
        metadata:
      ).process!
    end
end
