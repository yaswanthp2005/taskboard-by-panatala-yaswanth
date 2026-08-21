# frozen_string_literal: true

FactoryBot.define do
  factory :list do
    association :board
    sequence(:title) { |index| "List #{index}" }
  end
end
