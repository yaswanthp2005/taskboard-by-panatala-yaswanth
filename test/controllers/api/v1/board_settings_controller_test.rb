# frozen_string_literal: true

require "test_helper"

class Api::V1::BoardSettingsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @owner = create(:user)
    @member = create(:user)
    @other_user = create(:user)
    @board = create(:board, name: "Product Roadmap", color: "#4F46E5", owner: @owner)
    create(:board_member, board: @board, user: @member)
  end

  def test_show_allows_member_to_load_settings_page
    get api_v1_board_path(@board.slug), headers: headers(@member), as: :json

    assert_response :success
    assert_equal "Product Roadmap", response_body["name"]
    assert_equal "#4F46E5", response_body["color"]
    assert_not response_body["is_owner"]
  end

  def test_show_allows_owner_to_load_settings_page
    get api_v1_board_path(@board.slug), headers: headers(@owner), as: :json

    assert_response :success
    assert response_body["is_owner"]
  end

  def test_update_rename_is_owner_only
    patch api_v1_board_path(@board.slug),
      params: { board: { name: "Renamed Board" } },
      headers: headers(@member),
      as: :json

    assert_response :forbidden
    assert_equal "Product Roadmap", @board.reload.name
  end

  def test_update_color_is_owner_only
    patch api_v1_board_path(@board.slug),
      params: { board: { color: "#EF4444" } },
      headers: headers(@member),
      as: :json

    assert_response :forbidden
    assert_equal "#4F46E5", @board.reload.color
  end

  def test_destroy_is_owner_only
    assert_no_difference "Board.count" do
      delete api_v1_board_path(@board.slug), headers: headers(@member), as: :json
    end

    assert_response :forbidden
  end

  def test_owner_can_update_settings_fields
    patch api_v1_board_path(@board.slug),
      params: { board: { name: "Updated Roadmap", color: "#10B981" } },
      headers: headers(@owner),
      as: :json

    assert_response :success
    @board.reload
    assert_equal "Updated Roadmap", @board.name
    assert_equal "#10B981", @board.color
  end

  def test_owner_can_delete_board_from_settings
    assert_difference "Board.count", -1 do
      delete api_v1_board_path(@board.slug), headers: headers(@owner), as: :json
    end

    assert_response :success
  end

  def test_member_invite_is_owner_only
    invitee = create(:user, email: "invitee@example.com")

    post api_v1_board_members_path(@board.slug),
      params: { member: { email: invitee.email } },
      headers: headers(@member),
      as: :json

    assert_response :forbidden
    assert_not @board.members.exists?(id: invitee.id)
  end

  def test_owner_can_invite_member_from_settings
    invitee = create(:user, email: "invitee@example.com")

    assert_difference -> { @board.board_invitations.count }, 1 do
      assert_no_difference -> { @board.board_members.count } do
        post api_v1_board_members_path(@board.slug),
          params: { member: { email: invitee.email } },
          headers: headers(@owner),
          as: :json
      end
    end

    assert_response :success
    assert_not @board.members.exists?(id: invitee.id)
    assert @board.board_invitations.pending.exists?(invitee_id: invitee.id)
  end
end
