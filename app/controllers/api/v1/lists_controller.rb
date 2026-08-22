# frozen_string_literal: true

class Api::V1::ListsController < ApplicationController
  after_action :verify_authorized

  before_action :load_board
  before_action :load_list, only: %i[update destroy]

  def update
    authorize @list
    @list.update!(list_params)
    render_notice(t("successfully_updated", entity: "List"), :ok)
  end

  def destroy
    authorize @list
    @list.destroy!
    render_notice(t("successfully_deleted", count: 1, entity: "List"))
  end

  def reorder
    list = List.new(board: @board)
    authorize list, :reorder?

    ListReorderService.new(
      board: @board,
      list_ids: reorder_list_ids
    ).process

    render_notice(t("successfully_updated", entity: "Lists"), :ok)
  end

  private

    def load_board
      @board = policy_scope(Board).find_by!(slug: params[:board_slug])
    end

    def load_list
      @list = @board.lists.find(params[:id])
    end

    def list_params
      params.require(:list).permit(:title)
    end

    def reorder_list_ids
      params.require(:list_ids)
    end
end
