# frozen_string_literal: true

FactoryBot.define do
  factory :checklist_item do
    association :card
    sequence(:text) { |index| "Checklist item #{index}" }
    is_complete { false }
  end
end
