# frozen_string_literal: true

json.members @members do |member|
  json.partial! "api/v1/users/user", user: member
  json.role member.id == @board.owner_id ? "owner" : "member"
end

json.pagination @pagination
