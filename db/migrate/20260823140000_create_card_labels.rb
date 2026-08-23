# frozen_string_literal: true

class CreateCardLabels < ActiveRecord::Migration[7.1]
  def change
    create_table :card_labels, id: :uuid do |t|
      t.references :card, null: false, foreign_key: true, type: :uuid
      t.references :label, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end

    add_index :card_labels, [:card_id, :label_id], unique: true
  end
end
