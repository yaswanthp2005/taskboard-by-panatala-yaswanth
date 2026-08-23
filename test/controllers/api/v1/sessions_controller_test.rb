# frozen_string_literal: true

require "test_helper"

class Api::V1::SessionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
  end

  def test_create_logs_in_user_with_valid_credentials
    post api_v1_session_path,
      params: { login: { email: @user.email, password: @user.password } },
      as: :json

    assert_response :success
    assert_equal @user.authentication_token, response_body["authentication_token"]
  end

  def test_create_rejects_invalid_credentials
    post api_v1_session_path,
      params: { login: { email: @user.email, password: "invalid password" } },
      as: :json

    assert_response :unauthorized
    assert_equal I18n.t("invalid_credentials"), response_body["error"]
  end

  def test_destroy_regenerates_authentication_token
    original_token = @user.authentication_token

    delete api_v1_session_path, headers: headers(@user), as: :json

    assert_response :success
    assert_not_equal original_token, @user.reload.authentication_token
    assert_nil response_body["authentication_token"]
  end

  def test_destroy_requires_authentication
    delete api_v1_session_path, as: :json

    assert_response :unauthorized
  end
end
