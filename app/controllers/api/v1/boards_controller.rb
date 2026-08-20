# frozen_string_literal: true

class Api::V1::BoardsController < ApplicationController
  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index

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

  private

    def board_params
      params.require(:board).permit(:name, :color)
    end
end
