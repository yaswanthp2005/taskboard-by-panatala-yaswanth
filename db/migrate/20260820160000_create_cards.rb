# frozen_string_literal: true

class CreateCards < ActiveRecord::Migration[7.1]
  def change
    create_table :cards, id: :uuid do |t|
      t.references :list, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.integer :position, null: false

      t.timestamps
    end

    add_index :cards, %i[list_id position]
  end
end
