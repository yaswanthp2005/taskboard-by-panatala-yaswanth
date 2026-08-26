# frozen_string_literal: true

require "test_helper"

class Api::V1::BoardMembersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @owner = create(:user)
    @member = create(:user, email: "member@example.com")
    @other_user = create(:user)
    @board = create(:board, owner: @owner)
  end

  def test_create_invites_registered_user
    assert_difference -> { @board.board_members.count }, 1 do
      post api_v1_board_members_path(@board.slug),
        params: { member: { email: @member.email } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :success
    assert_equal I18n.t("board_member.invited_successfully"), response_body["notice"]
    assert @board.members.exists?(id: @member.id)
  end

  def test_create_rejects_non_registered_email
    assert_no_difference "BoardMember.count" do
      post api_v1_board_members_path(@board.slug),
        params: { member: { email: "unknown@example.com" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :unprocessable_entity
    assert_equal I18n.t("board_member.user_not_registered"), response_body["error"]
  end

  def test_create_rejects_blank_email
    assert_no_difference "BoardMember.count" do
      post api_v1_board_members_path(@board.slug),
        params: { member: { email: "" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :unprocessable_entity
    assert_equal I18n.t("board_member.email_required"), response_body["error"]
  end

  def test_create_rejects_duplicate_member
    create(:board_member, board: @board, user: @member)

    assert_no_difference "BoardMember.count" do
      post api_v1_board_members_path(@board.slug),
        params: { member: { email: @member.email } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :unprocessable_entity
    assert_equal I18n.t("board_member.already_member"), response_body["error"]
  end

  def test_create_rejects_inviting_board_owner
    assert_no_difference "BoardMember.count" do
      post api_v1_board_members_path(@board.slug),
        params: { member: { email: @owner.email } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :unprocessable_entity
    assert_equal I18n.t("board_member.owner_already_on_board"), response_body["error"]
  end

  def test_create_rejects_non_owner
    post api_v1_board_members_path(@board.slug),
      params: { member: { email: @member.email } },
      headers: headers(@other_user),
      as: :json

    assert_response :not_found
  end

  def test_create_rejects_board_member
    create(:board_member, board: @board, user: @member)

    post api_v1_board_members_path(@board.slug),
      params: { member: { email: "newmember@example.com" } },
      headers: headers(@member),
      as: :json

    assert_response :forbidden
  end

  def test_create_rejects_unauthenticated_request
    post api_v1_board_members_path(@board.slug),
      params: { member: { email: @member.email } },
      as: :json

    assert_response :unauthorized
  end

  def test_index_returns_owner_and_members
    create(:board_member, board: @board, user: @member)

    get api_v1_board_members_path(@board.slug), headers: headers(@owner), as: :json

    assert_response :success
    member_ids = response_body["members"].pluck("id")

    assert_equal [@owner.id, @member.id].sort, member_ids.sort

    owner_response = response_body["members"].find { |member| member["id"] == @owner.id }
    member_response = response_body["members"].find { |member| member["id"] == @member.id }

    assert_equal "owner", owner_response["role"]
    assert_equal "member", member_response["role"]
    assert_equal @owner.id, response_body["members"].first["id"]
  end

  def test_index_allows_board_member
    create(:board_member, board: @board, user: @member)

    get api_v1_board_members_path(@board.slug), headers: headers(@member), as: :json

    assert_response :success
    assert_equal [@owner.id, @member.id].sort, response_body["members"].pluck("id").sort
  end

  def test_index_rejects_non_member
    get api_v1_board_members_path(@board.slug), headers: headers(@other_user), as: :json

    assert_response :not_found
  end

  def test_index_paginates_members
    11.times do |index|
      user = create(:user, email: "member#{index}@example.com")
      create(:board_member, board: @board, user:)
    end

    get api_v1_board_members_path(@board.slug),
      params: { page: 2 },
      headers: headers(@owner),
      as: :json

    assert_response :success
    assert_equal 12, response_body.dig("pagination", "count")
    assert_equal 2, response_body.dig("pagination", "page")
    assert_equal 2, response_body["members"].size
  end
end
