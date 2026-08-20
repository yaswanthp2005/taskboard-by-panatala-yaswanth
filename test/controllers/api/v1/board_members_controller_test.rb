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
      post api_v1_board_members_path(@board),
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
      post api_v1_board_members_path(@board),
        params: { member: { email: "unknown@example.com" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :unprocessable_entity
    assert_equal I18n.t("board_member.user_not_registered"), response_body["error"]
  end

  def test_create_rejects_blank_email
    assert_no_difference "BoardMember.count" do
      post api_v1_board_members_path(@board),
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
      post api_v1_board_members_path(@board),
        params: { member: { email: @member.email } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :unprocessable_entity
    assert_equal I18n.t("board_member.already_member"), response_body["error"]
  end

  def test_create_rejects_inviting_board_owner
    assert_no_difference "BoardMember.count" do
      post api_v1_board_members_path(@board),
        params: { member: { email: @owner.email } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :unprocessable_entity
    assert_equal I18n.t("board_member.owner_already_on_board"), response_body["error"]
  end

  def test_create_rejects_non_owner
    post api_v1_board_members_path(@board),
      params: { member: { email: @member.email } },
      headers: headers(@other_user),
      as: :json

    assert_response :not_found
  end

  def test_create_rejects_unauthenticated_request
    post api_v1_board_members_path(@board),
      params: { member: { email: @member.email } },
      as: :json

    assert_response :unauthorized
  end
end
