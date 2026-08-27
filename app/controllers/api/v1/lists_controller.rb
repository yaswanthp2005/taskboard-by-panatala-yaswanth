# frozen_string_literal: true

class Api::V1::ListsController < ApplicationController
  before_action :load_board!
  before_action :load_list!, only: %i[update destroy move]

  def create
    list = @board.lists.build(list_params)
    list.save!
    record_activity!(
      board: @board,
      action: Constants::Activity::LIST_CREATED,
      metadata: { list_title: list.title }
    )
    render_notice(t("successfully_created", entity: t("entities.list")), :ok)
  end

  def update
    @list.update!(list_params)
    record_activity!(
      board: @board,
      action: Constants::Activity::LIST_UPDATED,
      metadata: { list_title: @list.title }
    )
    render_notice(t("successfully_updated", entity: t("entities.list")), :ok)
  end

  def destroy
    record_activity!(
      board: @board,
      action: Constants::Activity::LIST_DELETED,
      metadata: { list_title: @list.title }
    )
    @list.destroy!
    render_notice(t("successfully_deleted", count: 1, entity: t("entities.list")))
  end

  def move
    ListMoveService.new(
      list: @list,
      position: move_params[:position]
    ).process!

    render_notice(t("successfully_updated", entity: t("entities.list")), :ok)
  end

  private

    def load_board!
      @board = policy_scope(Board).find_by!(slug: params[:board_slug])
    end

    def load_list!
      @list = @board.lists.find(params[:id])
    end

    def list_params
      params.require(:list).permit(:title)
    end

    def move_params
      params.permit(:position)
    end
end
