# frozen_string_literal: true

class BoardPolicy < ApplicationPolicy
  def index?
    user.present?
  end

  def create?
    user.present?
  end

  class Scope < Scope
    def resolve
      return scope.none if user.blank?

      scope.where(owner_id: user.id)
    end
  end
end
