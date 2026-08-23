# frozen_string_literal: true

class ChecklistItemPolicy < ApplicationPolicy
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
      user.present? && (owner? || member?)
    end

    def owner?
      record.card.board.owner_id == user.id
    end

    def member?
      record.card.board.members.exists?(id: user.id)
    end
end
