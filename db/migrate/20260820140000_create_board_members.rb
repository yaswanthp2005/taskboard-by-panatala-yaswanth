# frozen_string_literal: true

class CreateBoardMembers < ActiveRecord::Migration[7.1]
  def change
    create_table :board_members, id: :uuid do |t|
      t.references :board, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end

    add_index :board_members, [:board_id, :user_id], unique: true
  end
end
