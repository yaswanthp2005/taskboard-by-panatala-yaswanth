# frozen_string_literal: true

class Api::V1::CardsController < ApplicationController
  after_action :verify_authorized

  before_action :load_board
  before_action :load_card, only: %i[show update]

  def show
    authorize @card
  end

  def update
    authorize @card
    @card.update!(card_params)
    render_notice(t("successfully_updated", entity: "Card"), :ok)
  end

  private

    def load_board
      @board = policy_scope(Board).find_by!(slug: params[:board_slug])
    end

    def load_card
      @card = @board.cards.find(params[:id])
    end

    def card_params
      params.require(:card).permit(:title)
    end
end
