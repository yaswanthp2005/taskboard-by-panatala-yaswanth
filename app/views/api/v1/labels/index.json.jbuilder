# frozen_string_literal: true

json.labels @labels do |label|
  json.partial! "api/v1/labels/label", label: label
end
