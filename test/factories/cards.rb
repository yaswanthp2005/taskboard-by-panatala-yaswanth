# frozen_string_literal: true

FactoryBot.define do
  factory :card do
    association :list
    sequence(:title) { |index| "Card #{index}" }
  end
end
