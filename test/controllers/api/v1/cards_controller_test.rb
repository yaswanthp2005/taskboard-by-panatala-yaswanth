# frozen_string_literal: true

require "test_helper"

class Api::V1::CardsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @owner = create(:user)
    @member = create(:user)
    @other_user = create(:user)
    @board = create(:board, owner: @owner)
    @card = create(:card, board: @board, title: "Fix login bug")
  end

  def test_show_allows_board_owner
    get api_v1_board_card_path(@board, @card), headers: headers(@owner), as: :json

    assert_response :success
    assert_equal @card.title, response_body["title"]
  end

  def test_show_allows_board_member
    create(:board_member, board: @board, user: @member)

    get api_v1_board_card_path(@board, @card), headers: headers(@member), as: :json

    assert_response :success
    assert_equal @card.title, response_body["title"]
  end

  def test_show_rejects_non_member
    get api_v1_board_card_path(@board, @card), headers: headers(@other_user), as: :json

    assert_response :not_found
  end

  def test_update_allows_board_member
    create(:board_member, board: @board, user: @member)

    patch api_v1_board_card_path(@board, @card),
      params: { card: { title: "Updated card title" } },
      headers: headers(@member),
      as: :json

    assert_response :success
    assert_equal "Updated card title", @card.reload.title
  end

  def test_update_rejects_non_member
    patch api_v1_board_card_path(@board, @card),
      params: { card: { title: "Updated card title" } },
      headers: headers(@other_user),
      as: :json

    assert_response :not_found
    assert_equal "Fix login bug", @card.reload.title
  end
end
