# frozen_string_literal: true

json.extract! card, :id, :title, :description, :due_date, :list_id, :position, :created_at, :updated_at
json.labels card.labels do |label|
  json.partial! "api/v1/labels/label", label: label
end
json.checklist_items card.checklist_items do |checklist_item|
  json.partial! "api/v1/checklist_items/checklist_item", checklist_item: checklist_item
end
