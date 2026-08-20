# frozen_string_literal: true

class BoardPolicy < ApplicationPolicy
  def index?
    user.present?
  end

  def create?
    user.present?
  end

  def update?
    owner?
  end

  def destroy?
    owner?
  end

  class Scope < Scope
    def resolve
      return scope.none if user.blank?

      scope.where(owner_id: user.id)
    end
  end

  private

    def owner?
      user.present? && record.owner_id == user.id
    end
end
