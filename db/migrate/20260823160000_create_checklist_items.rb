# frozen_string_literal: true

class CreateChecklistItems < ActiveRecord::Migration[7.1]
  def change
    create_table :checklist_items, id: :uuid do |t|
      t.references :card, null: false, foreign_key: true, type: :uuid
      t.string :text, null: false
      t.boolean :is_complete, null: false, default: false

      t.timestamps
    end
  end
end
