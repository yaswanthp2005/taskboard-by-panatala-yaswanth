# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_08_24_120000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "activities", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "board_id", null: false
    t.uuid "card_id"
    t.uuid "actor_id", null: false
    t.string "action", null: false
    t.jsonb "metadata", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["actor_id"], name: "index_activities_on_actor_id"
    t.index ["board_id", "created_at"], name: "index_activities_on_board_id_and_created_at"
    t.index ["board_id"], name: "index_activities_on_board_id"
    t.index ["card_id", "created_at"], name: "index_activities_on_card_id_and_created_at"
    t.index ["card_id"], name: "index_activities_on_card_id"
  end

  create_table "board_members", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "board_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["board_id", "user_id"], name: "index_board_members_on_board_id_and_user_id", unique: true
    t.index ["board_id"], name: "index_board_members_on_board_id"
    t.index ["user_id"], name: "index_board_members_on_user_id"
  end

  create_table "boards", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "owner_id", null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.text "description"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["owner_id", "name"], name: "index_boards_on_owner_id_and_name"
    t.index ["owner_id"], name: "index_boards_on_owner_id"
    t.index ["slug"], name: "index_boards_on_slug", unique: true
  end

  create_table "card_assignees", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "card_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["card_id", "user_id"], name: "index_card_assignees_on_card_id_and_user_id", unique: true
    t.index ["card_id"], name: "index_card_assignees_on_card_id"
    t.index ["user_id"], name: "index_card_assignees_on_user_id"
  end

  create_table "card_labels", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "card_id", null: false
    t.uuid "label_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["card_id", "label_id"], name: "index_card_labels_on_card_id_and_label_id", unique: true
    t.index ["card_id"], name: "index_card_labels_on_card_id"
    t.index ["label_id"], name: "index_card_labels_on_label_id"
  end

  create_table "cards", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "list_id", null: false
    t.string "title", null: false
    t.integer "position", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "description"
    t.date "due_date"
    t.index ["list_id", "position"], name: "index_cards_on_list_id_and_position"
    t.index ["list_id"], name: "index_cards_on_list_id"
  end

  create_table "checklist_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "card_id", null: false
    t.string "text", null: false
    t.boolean "is_complete", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["card_id"], name: "index_checklist_items_on_card_id"
  end

  create_table "labels", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "board_id", null: false
    t.string "name", null: false
    t.string "color", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["board_id", "name"], name: "index_labels_on_board_id_and_name", unique: true
    t.index ["board_id"], name: "index_labels_on_board_id"
  end

  create_table "lists", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "board_id", null: false
    t.string "title", null: false
    t.integer "position", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["board_id", "position"], name: "index_lists_on_board_id_and_position"
    t.index ["board_id"], name: "index_lists_on_board_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "authentication_token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["authentication_token"], name: "index_users_on_authentication_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "activities", "boards"
  add_foreign_key "activities", "cards"
  add_foreign_key "activities", "users", column: "actor_id"
  add_foreign_key "board_members", "boards"
  add_foreign_key "board_members", "users"
  add_foreign_key "boards", "users", column: "owner_id"
  add_foreign_key "card_assignees", "cards"
  add_foreign_key "card_assignees", "users"
  add_foreign_key "card_labels", "cards"
  add_foreign_key "card_labels", "labels"
  add_foreign_key "cards", "lists"
  add_foreign_key "checklist_items", "cards"
  add_foreign_key "labels", "boards"
  add_foreign_key "lists", "boards"
end
