# frozen_string_literal: true

class ListPolicy < ApplicationPolicy
  def create?
    accessible?
  end

  def update?
    accessible?
  end

  def destroy?
    accessible?
  end

  def move?
    accessible?
  end

  private

    def accessible?
      user.present? && (owner? || member?)
    end

    def owner?
      record.board.owner_id == user.id
    end

    def member?
      record.board.members.exists?(id: user.id)
    end
end
