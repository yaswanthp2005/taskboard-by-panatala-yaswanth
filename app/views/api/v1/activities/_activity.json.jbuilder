# frozen_string_literal: true

json.extract! activity, :id, :action, :metadata, :created_at
json.actor do
  json.partial! "api/v1/users/user", user: activity.actor
end
