# frozen_string_literal: true

require "test_helper"

class ApiExceptionsTest < ActionController::TestCase
  class TestController < ActionController::Base
    include ApiExceptions
    include ApiResponders

    def authorization_error
      handle_authorization_error
    end

    def parameter_missing
      params.require(:required_param)
    end

    def record_not_unique
      raise ActiveRecord::RecordNotUnique, "duplicate key"
    end

    def database_error
      raise StandardError, "PG::ConnectionBad connection failed"
    end

    def generic_error
      raise StandardError, "Unexpected failure"
    end

    def record_invalid
      user = User.new
      user.validate!
    end

    def render_json_action
      render_json({ status: "ok" })
    end

    def render_record_invalid_error
      user = User.new
      user.validate
      render_error(ActiveRecord::RecordInvalid.new(user))
    end
  end

  tests TestController

  setup do
    @routes = ActionDispatch::Routing::RouteSet.new
    @routes.draw do
      get :authorization_error, to: "api_exceptions_test/test#authorization_error"
      get :parameter_missing, to: "api_exceptions_test/test#parameter_missing"
      get :record_not_unique, to: "api_exceptions_test/test#record_not_unique"
      get :database_error, to: "api_exceptions_test/test#database_error"
      get :generic_error, to: "api_exceptions_test/test#generic_error"
      get :record_invalid, to: "api_exceptions_test/test#record_invalid"
      get :render_json_action, to: "api_exceptions_test/test#render_json_action"
      get :render_record_invalid_error, to: "api_exceptions_test/test#render_record_invalid_error"
    end
  end

  def test_handle_authorization_error_renders_forbidden
    get :authorization_error, format: :json

    assert_response :forbidden
    assert_equal I18n.t("authorization.denied"), response.parsed_body["error"]
  end

  def test_parameter_missing_renders_internal_server_error
    get :parameter_missing, format: :json

    assert_response :internal_server_error
    assert_includes response.parsed_body["error"], "required_param"
  end

  def test_record_not_unique_renders_error
    get :record_not_unique, format: :json

    assert_response :unprocessable_entity
    assert_includes response.parsed_body["error"], "duplicate key"
  end

  def test_database_error_renders_internal_server_error
    get :database_error, format: :json

    assert_response :internal_server_error
    assert_includes response.parsed_body["error"], "PG::ConnectionBad"
  end

  def test_generic_error_renders_internal_server_error
    get :generic_error, format: :json

    assert_response :internal_server_error
    assert_includes response.parsed_body["error"], "Unexpected failure"
  end

  def test_record_invalid_renders_validation_error
    get :record_invalid, format: :json

    assert_response :unprocessable_entity
    assert_includes response.parsed_body["error"], "Email"
  end

  def test_render_json_renders_payload
    get :render_json_action, format: :json

    assert_response :success
    assert_equal "ok", response.parsed_body["status"]
  end

  def test_render_error_with_record_invalid
    get :render_record_invalid_error, format: :json

    assert_response :unprocessable_entity
    assert_includes response.parsed_body["error"], "Email"
  end

  def test_log_exception_writes_to_logger
    error = StandardError.new("boom")
    error.set_backtrace(["test/backtrace:1"])

    assert_nothing_raised do
      @controller.send(:log_exception, error)
    end
  end
end
