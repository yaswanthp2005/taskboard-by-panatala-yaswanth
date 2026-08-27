# frozen_string_literal: true

require "test_helper"

class ApplicationPolicyTest < ActiveSupport::TestCase
  def setup
    @user = create(:user)
    @record = create(:board, owner: @user)
    @policy = ApplicationPolicy.new(@user, @record)
  end

  def test_default_actions_are_denied
    assert_not @policy.index?
    assert_not @policy.show?
    assert_not @policy.create?
    assert_not @policy.new?
    assert_not @policy.update?
    assert_not @policy.edit?
    assert_not @policy.destroy?
  end

  def test_scope_resolve_raises_not_implemented
    scope = ApplicationPolicy::Scope.new(@user, Board.all)

    assert_raises(NoMethodError) do
      scope.resolve
    end
  end
end
