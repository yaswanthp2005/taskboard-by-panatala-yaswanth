# frozen_string_literal: true

class CreateCards < ActiveRecord::Migration[7.1]
  def change
    create_table :cards, id: :uuid do |t|
      t.references :board, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false

      t.timestamps
    end
  end
end
