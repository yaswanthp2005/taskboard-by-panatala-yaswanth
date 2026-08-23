# frozen_string_literal: true

json.extract! card, :id, :title, :description, :due_date, :list_id, :position, :created_at, :updated_at
json.labels card.labels do |label|
  json.partial! "api/v1/labels/label", label: label
end
