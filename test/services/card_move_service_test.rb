# frozen_string_literal: true

require "test_helper"

class CardMoveServiceTest < ActiveSupport::TestCase
  def setup
    @owner = create(:user)
    @board = create(:board, owner: @owner)
    @list = create(:list, board: @board, title: "Todo")
    @card = create(:card, list: @list, title: "Task")
  end

  def test_process_moves_card_to_destination_list
    destination_list = create(:list, board: @board, title: "Done")

    CardMoveService.new(card: @card, destination_list:, position: 1).process!

    assert_equal destination_list, @card.reload.list
  end

  def test_process_rejects_destination_list_from_another_board
    other_board = create(:board, owner: @owner)
    destination_list = create(:list, board: other_board, title: "Other")

    error = assert_raises(ArgumentError) do
      CardMoveService.new(card: @card, destination_list:, position: 1).process!
    end

    assert_equal I18n.t("card.move.invalid_list"), error.message
  end

  def test_process_rejects_invalid_position
    error = assert_raises(ArgumentError) do
      CardMoveService.new(card: @card, destination_list: @list, position: 0).process!
    end

    assert_equal I18n.t("card.move.invalid_position"), error.message
  end
end
