# frozen_string_literal: true

class CreateLists < ActiveRecord::Migration[7.1]
  def change
    create_table :lists, id: :uuid do |t|
      t.references :board, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.integer :position, null: false

      t.timestamps
    end

    add_index :lists, %i[board_id position]
  end
end
