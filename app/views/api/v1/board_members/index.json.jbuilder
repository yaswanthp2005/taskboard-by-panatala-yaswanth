# frozen_string_literal: true

json.members @members do |member|
  json.partial! "api/v1/users/user", user: member
end
