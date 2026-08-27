# frozen_string_literal: true

class Api::V1::SessionsController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: :create

  def create
    @user = User.find_by!(email: login_params[:email].downcase)

    unless @user.authenticate(login_params[:password])
      render_error(t("invalid_credentials"), :unauthorized)
      return
    end

    @pending_invitation_token = BoardInvitationNotificationService.new(user: @user).process!
  end

  def destroy
    current_user.regenerate_authentication_token
  end

  private

    def login_params
      params.require(:login).permit(:email, :password)
    end
end
