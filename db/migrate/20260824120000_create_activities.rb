# frozen_string_literal: true

class CreateActivities < ActiveRecord::Migration[7.1]
  def change
    create_table :activities, id: :uuid do |t|
      t.references :board, null: false, foreign_key: true, type: :uuid
      t.references :card, foreign_key: true, type: :uuid
      t.references :actor, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.string :action, null: false
      t.jsonb :metadata, null: false, default: {}

      t.timestamps
    end

    add_index :activities, [:board_id, :created_at]
    add_index :activities, [:card_id, :created_at]
  end
end
