# frozen_string_literal: true

class ListPolicy < ApplicationPolicy
  def update?
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
