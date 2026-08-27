# frozen_string_literal: true

FactoryBot.define do
  factory :board_invitation do
    board
    inviter { board.owner }
    invitee factory: :user
    status { :pending }
  end
end
