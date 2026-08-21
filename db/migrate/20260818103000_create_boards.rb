# frozen_string_literal: true

class CreateBoards < ActiveRecord::Migration[7.1]
  def change
    create_table :boards, id: :uuid do |t|
      t.references :owner, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description
      t.string :color

      t.timestamps
    end

    add_index :boards, [:owner_id, :name]
    add_index :boards, :slug, unique: true
  end
end
