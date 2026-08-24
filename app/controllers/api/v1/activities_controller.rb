# frozen_string_literal: true

class Api::V1::ActivitiesController < ApplicationController
  after_action :verify_authorized

  before_action :load_card, if: -> { params[:card_id].present? }
  before_action :load_board, if: -> { params[:board_slug].present? }

  def index
    authorize @record, policy_class: ActivityPolicy
    @activities = @record.activities.order(created_at: :asc).includes(:actor)
  end

  private

    def load_card
      @card = Card.joins(list: :board)
        .merge(policy_scope(Board))
        .find(params[:card_id])
      @record = @card
      @activities_scope = @card.activities
    end

    def load_board
      @board = policy_scope(Board).find_by!(slug: params[:board_slug])
      @record = @board
      @activities_scope = @board.activities
    end
end
