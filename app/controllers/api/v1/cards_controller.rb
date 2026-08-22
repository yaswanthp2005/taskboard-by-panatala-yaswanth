# frozen_string_literal: true

class Api::V1::CardsController < ApplicationController
  after_action :verify_authorized

  before_action :load_board, only: :create
  before_action :load_list, only: :create
  before_action :load_card, only: %i[show update move]

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

  def move
    authorize @card, :move?

    destination_list = @card.board.lists.find(move_params[:list_id])

    CardMoveService.new(
      card: @card,
      destination_list:,
      position: move_params[:position]
    ).process

    render_notice(t("successfully_updated", entity: "Card"), :ok)
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

    def move_params
      params.permit(:list_id, :position)
    end
end
