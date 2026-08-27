# frozen_string_literal: true

class CreateBoardInvitations < ActiveRecord::Migration[7.1]
  def change
    create_table :board_invitations, id: :uuid do |t|
      t.references :board, null: false, foreign_key: true, type: :uuid
      t.references :inviter, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.references :invitee, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.string :token, null: false
      t.string :status, null: false, default: "pending"
      t.datetime :invitation_email_sent_at
      t.datetime :accepted_at
      t.timestamps
    end

    add_index :board_invitations, :token, unique: true
    add_index :board_invitations, [:board_id, :invitee_id], unique: true
    add_index :board_invitations, :status
  end
end
