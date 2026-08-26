# frozen_string_literal: true

class ListMoveService
  def initialize(list:, position:)
    @list = list
    @position = position.to_i
  end

  def process!
    validate_position!
    @list.insert_at(@position)
  end

  private

    def validate_position!
      return if @position.positive?

      raise ArgumentError, I18n.t("list.move.invalid_position")
    end
end
