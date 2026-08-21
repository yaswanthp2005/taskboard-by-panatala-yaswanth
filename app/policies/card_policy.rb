# frozen_string_literal: true

class CardPolicy < ApplicationPolicy
  def show?
    accessible?
  end

  def update?
    accessible?
  end

  private

    def owner?
      user.present? && record.board.owner_id == user.id
    end

    def member?
      user.present? && record.board.members.exists?(id: user.id)
    end

    def accessible?
      owner? || member?
    end
end
