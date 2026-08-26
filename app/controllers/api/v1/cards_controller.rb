# frozen_string_literal: true

class Api::V1::CardsController < ApplicationController
  after_action :verify_authorized

  before_action :load_board!, only: %i[index create]
  before_action :load_list!, only: :create
  before_action :load_card!, only: %i[show update move destroy]

  def index
    authorize @board, :show?
    @filtered_card_ids = CardFilterService.new(@board.cards, params:).process.pluck(:id).to_set
  end

  def create
    card = @list.cards.build(card_params)
    authorize card
    card.save!
    record_activity!(
      board: @board,
      action: Constants::Activity::CARD_CREATED,
      card:,
      metadata: { card_title: card.title, list_title: @list.title }
    )
    render_notice(t("successfully_created", entity: t("entities.card")), :ok)
  end

  def show
    authorize @card
  end

  def update
    authorize @card
    @card.update!(card_params)
    record_activity!(
      board: @card.board,
      action: Constants::Activity::CARD_UPDATED,
      card: @card,
      metadata: { card_title: @card.title }
    )
    render_notice(t("successfully_updated", entity: t("entities.card")), :ok)
  end

  def move
    authorize @card, :move?

    destination_list = @card.board.lists.find(move_params[:list_id])
    source_list_title = @card.list.title

    CardMoveService.new(
      card: @card,
      destination_list:,
      position: move_params[:position]
    ).process!

    record_activity!(
      board: @card.board,
      action: Constants::Activity::CARD_MOVED,
      card: @card,
      metadata: {
        card_title: @card.title,
        source_list_title:,
        destination_list_title: destination_list.title
      }
    )
  end

  def destroy
    authorize @card
    record_activity!(
      board: @card.board,
      action: Constants::Activity::CARD_DELETED,
      card: @card,
      metadata: { card_title: @card.title, list_title: @card.list.title }
    )
    @card.destroy!
    render_notice(t("successfully_deleted", count: 1, entity: t("entities.card")))
  end

  private

    def load_board!
      @board = policy_scope(Board)
        .includes(lists: { cards: [:assignees, :labels] })
        .find_by!(slug: params[:board_slug])
    end

    def load_list!
      @list = @board.lists.find(params[:list_id])
    end

    def load_card!
      @card = Card.joins(list: :board)
        .merge(policy_scope(Board))
        .includes(:labels, :checklist_items, :assignees)
        .find(params[:id])
    end

    def card_params
      params.require(:card).permit(:title, :description, :due_date, :is_complete, label_ids: [], assignee_ids: [])
    end

    def move_params
      params.permit(:list_id, :position)
    end
end
