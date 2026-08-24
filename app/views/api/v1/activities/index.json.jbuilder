# frozen_string_literal: true

json.activities @activities do |activity|
  json.partial! "api/v1/activities/activity", activity: activity
end
