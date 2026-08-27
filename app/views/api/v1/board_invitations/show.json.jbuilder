# frozen_string_literal: true

json.board_name @invitation.board.name
json.board_slug @invitation.board.slug
json.inviter_name full_name(@invitation.inviter)
