# frozen_string_literal: true

class AddIsCompleteToCards < ActiveRecord::Migration[7.1]
  def change
    add_column :cards, :is_complete, :boolean, null: false, default: false
  end
end
