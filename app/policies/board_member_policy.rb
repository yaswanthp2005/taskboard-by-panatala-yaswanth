# frozen_string_literal: true

class BoardMemberPolicy < ApplicationPolicy
  def create?
    owner?
  end

  def destroy?
    owner?
  end

  private

    def owner?
      user.present? && record.board.owner_id == user.id
    end
end
