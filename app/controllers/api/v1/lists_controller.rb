# frozen_string_literal: true

class Api::V1::ListsController < ApplicationController
  after_action :verify_authorized

  before_action :load_board
  before_action :load_list, only: :update

  def update
    authorize @list
    @list.update!(list_params)
    render_notice(t("successfully_updated", entity: "List"), :ok)
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
end
