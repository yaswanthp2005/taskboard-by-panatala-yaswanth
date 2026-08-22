# frozen_string_literal: true

class CardPolicy < ApplicationPolicy
  def show?
    accessible?
  end

  def create?
    accessible?
  end

  def update?
    accessible?
  end

  def reorder?
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
