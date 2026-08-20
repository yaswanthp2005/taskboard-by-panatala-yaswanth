# frozen_string_literal: true

class BoardMemberPolicy < ApplicationPolicy
  def create?
    user.present? && record.board.owner_id == user.id
  end
end
