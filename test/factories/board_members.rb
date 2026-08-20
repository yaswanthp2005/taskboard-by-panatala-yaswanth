# frozen_string_literal: true

FactoryBot.define do
  factory :board_member do
    association :board
    association :user
  end
end
