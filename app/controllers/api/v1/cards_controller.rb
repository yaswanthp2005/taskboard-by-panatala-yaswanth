# frozen_string_literal: true

class Api::V1::CardsController < ApplicationController
  after_action :verify_authorized

  before_action :load_board, only: %i[create reorder]
  before_action :load_list, only: %i[create reorder]
  before_action :load_card, only: %i[show update]

  def create
    card = @list.cards.build(card_params)
    authorize card
    card.save!
    render_notice(t("successfully_created", entity: "Card"), :ok)
  end

  def show
    authorize @card
  end

  def update
    authorize @card
    @card.update!(card_params)
    render_notice(t("successfully_updated", entity: "Card"), :ok)
  end

  def reorder
    card = Card.new(list: @list)
    authorize card, :reorder?

    CardReorderService.new(
      list: @list,
      card_ids: reorder_card_ids
    ).process

    render_notice(t("successfully_updated", entity: "Cards"), :ok)
  end

  private

    def load_board
      @board = policy_scope(Board).find_by!(slug: params[:board_slug])
    end

    def load_list
      @list = @board.lists.find(params[:list_id])
    end

    def load_card
      @card = Card.joins(list: :board).merge(policy_scope(Board)).find(params[:id])
    end

    def card_params
      params.require(:card).permit(:title)
    end

    def reorder_card_ids
      params.require(:card_ids)
    end
end
