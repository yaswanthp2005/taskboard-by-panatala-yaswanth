# frozen_string_literal: true

class Api::V1::BoardInvitationsController < ApplicationController
  def show
    @invitation = BoardInvitationShowService.new(
      token: params[:token],
      user: current_user
    ).process!
  rescue BoardInvitationShowService::Error => exception
    render_error(exception.message, :unprocessable_entity)
  end

  def accept
    board = BoardInvitationAcceptService.new(
      token: params[:token],
      user: current_user
    ).process!

    render_notice(t("board_member.invitation_accepted"), :ok, board_slug: board.slug)
  rescue BoardInvitationAcceptService::Error => exception
    render_error(exception.message, :unprocessable_entity)
  end
end
