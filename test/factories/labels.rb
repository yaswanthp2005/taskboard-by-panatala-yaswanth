# frozen_string_literal: true

FactoryBot.define do
  factory :label do
    association :board
    sequence(:name) { |index| "Label #{index}" }
    color { "#4F46E5" }
  end
end
