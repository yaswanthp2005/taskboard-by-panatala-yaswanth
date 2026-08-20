# frozen_string_literal: true

class Api::v1::BoardMembersController < ApplicationController
  after_action :verify_authorized, except: :index

  before_action :load_board

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
      @board = policy_scope(Board).find(params[:board_id])
    end

    def member_params
      params.require(:member).permit(:email)
    end
end
