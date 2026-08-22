# frozen_string_literal: true

class CardMoveService
  def initialize(card:, destination_list:, position:)
    @card = card
    @destination_list = destination_list
    @position = position.to_i
  end

  def process
    validate_destination_list!
    validate_position!

    ActiveRecord::Base.transaction do
      if @card.list_id == @destination_list.id
        @card.insert_at(@position)
      else
        @card.update!(list: @destination_list)
        @card.insert_at(@position)
      end
    end
  end

  private

    def validate_destination_list!
      return if @destination_list.board_id == @card.list.board_id

      raise ArgumentError, I18n.t("card.move.invalid_list")
    end

    def validate_position!
      return if @position.positive?

      raise ArgumentError, I18n.t("card.move.invalid_position")
    end
end
