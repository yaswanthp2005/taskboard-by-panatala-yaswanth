# frozen_string_literal: true

class Api::V1::BoardsController < ApplicationController
  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index

  before_action :load_board, only: %i[show update destroy]

  def index
    authorize Board
    boards = policy_scope(Board).order(updated_at: :desc)
    boards = BoardFilterService.new(boards, params:).process
    @pagy, @boards = pagy(boards)
    @pagination = pagy_metadata(@pagy)
  end

  def create
    board = current_user.boards.build(board_params)
    authorize board
    board.save!
    render_notice(t("successfully_created", entity: "Board"), :ok)
  end

  def show
    authorize @board
  end

  def update
    authorize @board
    @board.update!(board_params)
    render_notice(t("successfully_updated", entity: "Board"), :ok)
  end

  def destroy
    authorize @board
    @board.destroy!
    render_notice(t("successfully_deleted", count: 1, entity: "Board"))
  end

  private

    def load_board
      @board = policy_scope(Board).find_by!(slug: params[:slug])
    end

    def board_params
      params.require(:board).permit(:name, :description, :color)
    end
end
