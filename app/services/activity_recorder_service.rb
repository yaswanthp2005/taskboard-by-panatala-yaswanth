# frozen_string_literal: true

class ActivityRecorderService
  def initialize(board:, actor:, action:, card: nil, metadata: {})
    @board = board
    @actor = actor
    @action = action
    @card = card
    @metadata = metadata
  end

  def process
    Activity.create!(
      board: @board,
      actor: @actor,
      action: @action,
      card: @card,
      metadata: @metadata
    )
  end
end
