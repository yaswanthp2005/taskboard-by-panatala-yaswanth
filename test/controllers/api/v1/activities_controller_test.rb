# frozen_string_literal: true

require "test_helper"

class Api::V1::ActivitiesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @owner = create(:user)
    @member = create(:user)
    @other_user = create(:user)
    @board = create(:board, owner: @owner)
    @list = create(:list, board: @board, title: "To Do")
    @card = create(:card, list: @list, title: "Fix login bug")
    @activity = create(
      :activity,
      board: @board,
      actor: @owner,
      card: @card,
      action: Constants::Activity::CARD_CREATED,
      metadata: { card_title: @card.title, list_title: @list.title }
    )
  end

  def test_index_returns_card_activities_for_owner
    get api_v1_card_activities_path(@card), headers: headers(@owner), as: :json

    assert_response :success
    assert_equal 1, response_body["activities"].size
    assert_equal @activity.id, response_body["activities"].first["id"]
    assert_equal Constants::Activity::CARD_CREATED, response_body["activities"].first["action"]
    assert_equal @owner.id, response_body["activities"].first["actor"]["id"]
  end

  def test_index_allows_board_member
    create(:board_member, board: @board, user: @member)

    get api_v1_card_activities_path(@card), headers: headers(@member), as: :json

    assert_response :success
    assert_equal 1, response_body["activities"].size
  end

  def test_index_rejects_non_member
    get api_v1_card_activities_path(@card), headers: headers(@other_user), as: :json

    assert_response :not_found
  end

  def test_board_index_returns_all_board_activities
    list_activity = create(
      :activity,
      board: @board,
      actor: @owner,
      card: nil,
      action: Constants::Activity::LIST_CREATED,
      metadata: { list_title: "Backlog" }
    )

    get api_v1_board_activities_path(@board.slug), headers: headers(@owner), as: :json

    assert_response :success
    assert_equal 2, response_body["activities"].size
    activity_ids = response_body["activities"].pluck("id")

    assert_includes activity_ids, @activity.id
    assert_includes activity_ids, list_activity.id
  end

  def test_board_index_allows_board_member
    create(:board_member, board: @board, user: @member)

    get api_v1_board_activities_path(@board.slug), headers: headers(@member), as: :json

    assert_response :success
    assert_equal 1, response_body["activities"].size
  end

  def test_board_index_rejects_non_member
    get api_v1_board_activities_path(@board.slug), headers: headers(@other_user), as: :json

    assert_response :not_found
  end

  def test_create_card_records_activity
    assert_difference -> { Activity.where(action: Constants::Activity::CARD_CREATED).count }, 1 do
      post api_v1_board_list_cards_path(@board.slug, @list),
        params: { card: { title: "New card" } },
        headers: headers(@owner),
        as: :json
    end

    activity = Activity.order(:created_at).last
    assert_equal Constants::Activity::CARD_CREATED, activity.action
    assert_equal @owner, activity.actor
    assert_equal @board, activity.board
    assert_equal "New card", activity.metadata["card_title"]
  end

  def test_update_card_records_activity
    assert_difference -> { @card.activities.where(action: Constants::Activity::CARD_UPDATED).count }, 1 do
      patch api_v1_card_path(@card),
        params: { card: { title: "Updated title" } },
        headers: headers(@owner),
        as: :json
    end

    activity = @card.activities.order(:created_at).last
    assert_equal Constants::Activity::CARD_UPDATED, activity.action
    assert_equal @owner, activity.actor
  end

  def test_move_card_records_activity
    destination_list = create(:list, board: @board, title: "Done")

    assert_difference -> { @card.activities.where(action: Constants::Activity::CARD_MOVED).count }, 1 do
      patch move_api_v1_card_path(@card),
        params: { list_id: destination_list.id, position: 1 },
        headers: headers(@owner),
        as: :json
    end

    activity = @card.activities.order(:created_at).last
    assert_equal Constants::Activity::CARD_MOVED, activity.action
    assert_equal "To Do", activity.metadata["source_list_title"]
    assert_equal "Done", activity.metadata["destination_list_title"]
  end

  def test_destroy_card_records_activity
    assert_difference -> { Activity.where(action: Constants::Activity::CARD_DELETED).count }, 1 do
      delete api_v1_card_path(@card), headers: headers(@owner), as: :json
    end

    activity = Activity.order(:created_at).last
    assert_equal Constants::Activity::CARD_DELETED, activity.action
    assert_equal "Fix login bug", activity.metadata["card_title"]
  end
end
