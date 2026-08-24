# frozen_string_literal: true

class Api::V1::BoardMembersController < ApplicationController
  after_action :verify_authorized

  before_action :load_board

  def index
    authorize BoardMember
    @members = User.where(id: [@board.owner_id] + @board.member_ids)
      .order(:first_name, :last_name)
  end

  def create
    board_member = BoardMember.new(board: @board)
    authorize board_member

    BoardInviteService.new(
      board: @board,
      inviter: current_user,
      email: member_params[:email]
    ).process

    render_notice(t("board_member.invited_successfully"), :ok)
  rescue BoardInviteService::Error => exception
    render_error(exception.message, :unprocessable_entity)
  end

  private

    def load_board
      @board = policy_scope(Board).find_by!(slug: params[:board_slug])
    end

    def member_params
      params.require(:member).permit(:email)
    end
end
