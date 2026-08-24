# frozen_string_literal: true

class BoardMemberPolicy < ApplicationPolicy
  def index?
    user.present?
  end

  def create?
    user.present? && record.board.owner_id == user.id
  end
end
