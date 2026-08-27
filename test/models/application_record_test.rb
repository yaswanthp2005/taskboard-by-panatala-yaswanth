# frozen_string_literal: true

require "test_helper"

class ApplicationRecordTest < ActiveSupport::TestCase
  def test_errors_to_sentence_returns_validation_messages
    user = build(:user, first_name: nil)

    assert_not user.valid?
    assert_includes user.errors_to_sentence, "First name"
  end
end
