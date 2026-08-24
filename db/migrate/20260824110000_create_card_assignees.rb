# frozen_string_literal: true

class CreateCardAssignees < ActiveRecord::Migration[7.1]
  def change
    create_table :card_assignees, id: :uuid do |t|
      t.references :card, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end

    add_index :card_assignees, [:card_id, :user_id], unique: true
  end
end
