# frozen_string_literal: true

class AddDescriptionAndDueDateToCards < ActiveRecord::Migration[7.1]
  def change
    add_column :cards, :description, :text
    add_column :cards, :due_date, :date
  end
end
