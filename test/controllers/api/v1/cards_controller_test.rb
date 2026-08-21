# frozen_string_literal: true

require "test_helper"

class Api::V1::CardsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @owner = create(:user)
    @member = create(:user)
    @other_user = create(:user)
    @board = create(:board, owner: @owner)
    @list = create(:list, board: @board, title: "To Do")
    @card = create(:card, list: @list, title: "Fix login bug")
  end

  def test_create_adds_card_to_list_for_owner
    assert_difference -> { @list.cards.count }, 1 do
      post api_v1_board_list_cards_path(@board.slug, @list),
        params: { card: { title: "Write tests" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :success
    card = @list.cards.find_by!(title: "Write tests")
    assert_equal 2, card.position
    assert_equal I18n.t("successfully_created", entity: "Card"), response_body["notice"]
  end

  def test_create_adds_card_to_list_for_member
    create(:board_member, board: @board, user: @member)

    assert_difference -> { @list.cards.count }, 1 do
      post api_v1_board_list_cards_path(@board.slug, @list),
        params: { card: { title: "Review pull request" } },
        headers: headers(@member),
        as: :json
    end

    assert_response :success
    assert_equal "Review pull request", @list.cards.last.title
  end

  def test_create_rejects_blank_title
    assert_no_difference -> { @list.cards.count } do
      post api_v1_board_list_cards_path(@board.slug, @list),
        params: { card: { title: "" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :unprocessable_entity
    assert_equal "Title can't be blank", response_body["error"]
  end

  def test_create_rejects_non_member
    assert_no_difference -> { @list.cards.count } do
      post api_v1_board_list_cards_path(@board.slug, @list),
        params: { card: { title: "Unauthorized card" } },
        headers: headers(@other_user),
        as: :json
    end

    assert_response :not_found
  end

  def test_show_allows_board_owner
    get api_v1_card_path(@card), headers: headers(@owner), as: :json

    assert_response :success
    assert_equal @card.title, response_body["title"]
  end

  def test_show_allows_board_member
    create(:board_member, board: @board, user: @member)

    get api_v1_card_path(@card), headers: headers(@member), as: :json

    assert_response :success
    assert_equal @card.title, response_body["title"]
  end

  def test_show_rejects_non_member
    get api_v1_card_path(@card), headers: headers(@other_user), as: :json

    assert_response :not_found
  end

  def test_update_allows_board_member
    create(:board_member, board: @board, user: @member)

    patch api_v1_card_path(@card),
      params: { card: { title: "Updated card title" } },
      headers: headers(@member),
      as: :json

    assert_response :success
    assert_equal "Updated card title", @card.reload.title
  end

  def test_update_rejects_non_member
    patch api_v1_card_path(@card),
      params: { card: { title: "Updated card title" } },
      headers: headers(@other_user),
      as: :json

    assert_response :not_found
    assert_equal "Fix login bug", @card.reload.title
  end
end
