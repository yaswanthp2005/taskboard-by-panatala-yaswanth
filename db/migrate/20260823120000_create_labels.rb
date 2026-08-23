# frozen_string_literal: true

class CreateLabels < ActiveRecord::Migration[7.1]
  def change
    create_table :labels, id: :uuid do |t|
      t.references :board, null: false, foreign_key: true, type: :uuid
      t.string :name, null: false
      t.string :color, null: false

      t.timestamps
    end

    add_index :labels, [:board_id, :name], unique: true
  end
end
