# frozen_string_literal: true

desc "drops the db, creates db, migrates db and populates sample data"
task setup: [:environment, "db:drop", "db:create", "db:migrate"] do
  Rake::Task["reset_and_populate_sample_data"].invoke if Rails.env.development?
end

desc "Populates sample data without resetting the database first"
task populate_sample_data: [:environment] do
  create_sample_data!
  puts "sample data has been added."
end

desc "Populates sample data without after resetting the database"
task reset_and_populate_sample_data: [:environment] do
  if Rails.env.production?
    puts "Skipping deleting and populating sample data"
  elsif Rails.env.staging?
    puts "Skipping deleting and populating sample data"
  else
    delete_all_records_from_all_tables
    Rake::Task["populate_sample_data"].invoke
  end
end

#
# DO NOT CHANGE ANYTHING IN THIS METHOD
# This is last layer of defense against deleting data in production
# If you need to delete data in staging or in production
# please execute the command manually and do not change this method
#
def delete_all_records_from_all_tables
  if Rails.env.production?
    raise "deleting all records in production is not alllowed"
  else
    Rake::Task["db:schema:load"].invoke
  end
end

def create_sample_data!
  create_users!
  oliver = User.find_by!(email: "oliver@example.com")
  luna = User.find_by!(email: "luna@example.com")
  create_boards!(oliver, luna)
end

def create_users!
  [
    {
      first_name: "Oliver",
      last_name: "Smith",
      email: "oliver@example.com"
    },
    {
      first_name: "Luna",
      last_name: "Smith",
      email: "luna@example.com"
    },
    {
      first_name: "Sam",
      last_name: "Smith",
      email: "sam@example.com"
    }
  ].each do |user_attributes|
    User.create!(
      user_attributes.merge(
        password: default_user_password,
        password_confirmation: default_user_password
      )
    )
  end
end

SAMPLE_BOARD_DEFINITIONS = [
  { name: "Product Roadmap", description: "Track upcoming features and releases.", color: "#4F46E5" },
  { name: "Engineering Sprint", description: "Current sprint tasks and bugs.", color: "#059669" },
  { name: "Design Backlog", description: "UI/UX improvements and design reviews.", color: "#DC2626" },
  { name: "Marketing Campaigns", description: "Campaign planning and content calendar.", color: "#D97706" },
  { name: "Customer Support", description: "Support tickets and follow-ups.", color: "#0891B2" },
  { name: "HR Onboarding", description: "New hire onboarding checklist.", color: "#7C3AED" },
  { name: "Sales Pipeline", description: "Leads and deal stages.", color: "#DB2777" },
  { name: "Personal Tasks", description: "Day-to-day personal to-dos.", color: "#64748B" },
  { name: "Research Ideas", description: "Exploratory ideas and spikes.", color: "#0D9488" },
  { name: "Release Checklist", description: "Pre-release verification steps.", color: "#EA580C" },
  { name: "Team Retrospective", description: "Action items from retrospectives.", color: "#2563EB" },
  { name: "Documentation", description: "Docs to write and update.", color: "#9333EA" }
].freeze

DEFAULT_LIST_TITLES = ["To Do", "In Progress", "Done"].freeze

SAMPLE_CARDS_BY_LIST = {
  "To Do" => ["Set up project board", "Review requirements"],
  "In Progress" => ["Design board layout"],
  "Done" => ["Create user accounts"]
}.freeze

def create_boards!(primary_owner, secondary_owner)
  SAMPLE_BOARD_DEFINITIONS.each do |definition|
    board = primary_owner.boards.create!(definition)
    create_lists!(board)
  end

  board = secondary_owner.boards.create!(
    name: "Luna's Project Board",
    description: "Private board for Luna's projects.",
    color: "#16A34A"
  )
  create_lists!(board)
end

def create_lists!(board)
  DEFAULT_LIST_TITLES.each do |title|
    list = board.lists.create!(title:)
    create_sample_cards!(list)
  end
end

def create_sample_cards!(list)
  SAMPLE_CARDS_BY_LIST.fetch(list.title, []).each do |title|
    list.cards.create!(title:)
  end
end

def default_user_password
  "welcome"
end

desc "Populates sample boards for existing users"
task populate_boards: [:environment] do
  oliver = User.find_by!(email: "oliver@example.com")
  luna = User.find_by!(email: "luna@example.com")
  create_boards!(oliver, luna)
  puts "sample boards have been added."
end
