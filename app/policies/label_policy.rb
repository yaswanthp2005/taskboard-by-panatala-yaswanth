# frozen_string_literal: true

class LabelPolicy < ApplicationPolicy
  def index?
    accessible?
  end

  def create?
    accessible?
  end

  def update?
    accessible?
  end

  def destroy?
    accessible?
  end

  private

    def accessible?
      user.present?
    end
end
