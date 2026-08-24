# frozen_string_literal: true

FactoryBot.define do
  factory :activity do
    association :board
    association :actor, factory: :user
    action { Constants::Activity::CARD_CREATED }
    metadata { { card_title: "Sample card" } }

    trait :with_card do
      association :card
    end
  end
end
