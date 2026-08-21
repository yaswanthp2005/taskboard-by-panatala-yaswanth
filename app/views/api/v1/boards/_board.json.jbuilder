# frozen_string_literal: true

json.extract! board, :id, :name, :slug, :description, :color, :created_at, :updated_at
json.is_owner board.owner_id == @current_user&.id
