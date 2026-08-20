# frozen_string_literal: true

require "test_helper"

class PagySetupTest < ActiveSupport::TestCase
  def test_application_controller_includes_pagy_method
    assert_includes ApplicationController.included_modules, Pagy::Method
  end
end
