# frozen_string_literal: true

require "test_helper"

class Api::V1::BoardInvitationsControllerTest < ActionDispatch::IntegrationTest
  include ApplicationHelper

  def setup
    @owner = create(:user)
    @invitee = create(:user, email: "invitee@example.com")
    @other_user = create(:user)
    @board = create(:board, owner: @owner)
    @invitation = create(:board_invitation, board: @board, inviter: @owner, invitee: @invitee)
  end

  def test_accept_adds_member_and_returns_board_slug
    patch accept_api_v1_board_invitation_path(@invitation.token),
      headers: headers(@invitee),
      as: :json

    assert_response :success
    assert_equal I18n.t("board_member.invitation_accepted"), response_body["notice"]
    assert_equal @board.slug, response_body["board_slug"]
    assert @board.members.exists?(id: @invitee.id)
  end

  def test_accept_rejects_wrong_user
    patch accept_api_v1_board_invitation_path(@invitation.token),
      headers: headers(@other_user),
      as: :json

    assert_response :unprocessable_entity
    assert_equal I18n.t("board_member.invitation_invalid_recipient"), response_body["error"]
  end

  def test_accept_rejects_invalid_token
    patch accept_api_v1_board_invitation_path("invalid-token"),
      headers: headers(@invitee),
      as: :json

    assert_response :unprocessable_entity
    assert_equal I18n.t("board_member.invitation_not_found"), response_body["error"]
  end

  def test_show_returns_invitation_details
    get api_v1_board_invitation_path(@invitation.token),
      headers: headers(@invitee),
      as: :json

    assert_response :success
    assert_equal @board.name, response_body["board_name"]
    assert_equal @board.slug, response_body["board_slug"]
    assert_equal full_name(@owner), response_body["inviter_name"]
  end

  def test_show_rejects_wrong_user
    get api_v1_board_invitation_path(@invitation.token),
      headers: headers(@other_user),
      as: :json

    assert_response :unprocessable_entity
    assert_equal I18n.t("board_member.invitation_invalid_recipient"), response_body["error"]
  end

  def test_show_rejects_invalid_token
    get api_v1_board_invitation_path("invalid-token"),
      headers: headers(@invitee),
      as: :json

    assert_response :unprocessable_entity
    assert_equal I18n.t("board_member.invitation_not_found"), response_body["error"]
  end

  def test_accept_does_not_accept_other_pending_invitations
    other_owner = create(:user)
    other_board = create(:board, owner: other_owner)
    other_invitation = create(:board_invitation, board: other_board, inviter: other_owner, invitee: @invitee)

    patch accept_api_v1_board_invitation_path(@invitation.token),
      headers: headers(@invitee),
      as: :json

    assert_response :success
    assert @board.members.exists?(id: @invitee.id)
    assert_not other_board.members.exists?(id: @invitee.id)
    assert other_invitation.reload.pending?
  end
end
