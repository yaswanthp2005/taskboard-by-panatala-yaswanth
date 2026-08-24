# frozen_string_literal: true

class Activity < ApplicationRecord
  belongs_to :board
  belongs_to :card, optional: true
  belongs_to :actor, class_name: "User"

  validates :action, presence: true, inclusion: { in: Constants::Activity::ACTIONS }
end
