# frozen_string_literal: true

FactoryBot.define do
  factory :board do
    association :owner, factory: :user
    sequence(:name) { |index| "Board #{index}" }
    description { Faker::Lorem.sentence }
    color { "#4F46E5" }
  end
end
