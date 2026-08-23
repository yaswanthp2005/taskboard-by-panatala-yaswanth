# frozen_string_literal: true

FactoryBot.define do
  factory :card_label do
    association :card
    association :label

    after(:build) do |card_label|
      card_label.label ||= build(:label, board: card_label.card.board)
    end
  end
end
