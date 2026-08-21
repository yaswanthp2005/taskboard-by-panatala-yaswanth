# frozen_string_literal: true

class BoardPolicy < ApplicationPolicy
  def index?
    user.present?
  end

  def create?
    owner?
  end

  def show?
    accessible?
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

      owned_board_ids = scope.where(owner_id: user.id).select(:id)
      shared_board_ids = BoardMember.where(user_id: user.id).select(:board_id)

      scope.where(id: owned_board_ids).or(scope.where(id: shared_board_ids)).distinct
    end
  end

  private

    def owner?
      user.present? && record.owner_id == user.id
    end

    def member?
      user.present? && record.members.exists?(id: user.id)
    end

    def accessible?
      owner? || member?
    end
end
