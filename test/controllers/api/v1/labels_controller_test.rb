# frozen_string_literal: true

require "test_helper"

class Api::V1::LabelsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @owner = create(:user)
    @member = create(:user)
    @other_user = create(:user)
    @board = create(:board, owner: @owner)
    @label = create(:label, board: @board, name: "Bug", color: "#EF4444")
  end

  def test_index_returns_labels_for_board_owner
    urgent_label = create(:label, board: @board, name: "Urgent", color: "#F59E0B")
    other_board = create(:board, owner: @owner)
    create(:label, board: other_board, name: "Other")

    get api_v1_board_labels_path(@board.slug), headers: headers(@owner), as: :json

    assert_response :success
    response_labels = response_body["labels"]
    assert_equal [@label.id, urgent_label.id], response_labels.pluck("id")
    assert_equal %w[Bug Urgent], response_labels.pluck("name")
    assert_equal ["#EF4444", "#F59E0B"], response_labels.pluck("color")
  end

  def test_index_allows_board_member
    create(:board_member, board: @board, user: @member)

    get api_v1_board_labels_path(@board.slug), headers: headers(@member), as: :json

    assert_response :success
    assert_equal [@label.id], response_body["labels"].pluck("id")
  end

  def test_index_rejects_non_member
    get api_v1_board_labels_path(@board.slug), headers: headers(@other_user), as: :json

    assert_response :not_found
  end

  def test_create_adds_label_for_owner
    assert_difference -> { @board.labels.count }, 1 do
      post api_v1_board_labels_path(@board.slug),
        params: { label: { name: "Feature", color: "#10B981" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :success
    label = @board.labels.find_by!(name: "Feature")
    assert_equal "#10B981", label.color
    assert_equal I18n.t("successfully_created", entity: "Label"), response_body["notice"]
  end

  def test_create_allows_board_member
    create(:board_member, board: @board, user: @member)

    assert_difference -> { @board.labels.count }, 1 do
      post api_v1_board_labels_path(@board.slug),
        params: { label: { name: "Feature", color: "#10B981" } },
        headers: headers(@member),
        as: :json
    end

    assert_response :success
  end

  def test_create_rejects_blank_name
    assert_no_difference -> { @board.labels.count } do
      post api_v1_board_labels_path(@board.slug),
        params: { label: { name: "", color: "#10B981" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :unprocessable_entity
    assert_equal "Name can't be blank", response_body["error"]
  end

  def test_create_rejects_duplicate_name
    assert_no_difference -> { @board.labels.count } do
      post api_v1_board_labels_path(@board.slug),
        params: { label: { name: "bug", color: "#10B981" } },
        headers: headers(@owner),
        as: :json
    end

    assert_response :unprocessable_entity
    assert_equal "Name has already been taken", response_body["error"]
  end

  def test_create_rejects_non_member
    assert_no_difference -> { @board.labels.count } do
      post api_v1_board_labels_path(@board.slug),
        params: { label: { name: "Feature", color: "#10B981" } },
        headers: headers(@other_user),
        as: :json
    end

    assert_response :not_found
  end

  def test_update_changes_label_for_owner
    patch api_v1_board_label_path(@board.slug, @label),
      params: { label: { name: "Critical", color: "#DC2626" } },
      headers: headers(@owner),
      as: :json

    assert_response :success
    @label.reload
    assert_equal "Critical", @label.name
    assert_equal "#DC2626", @label.color
    assert_equal I18n.t("successfully_updated", entity: "Label"), response_body["notice"]
  end

  def test_update_allows_board_member
    create(:board_member, board: @board, user: @member)

    patch api_v1_board_label_path(@board.slug, @label),
      params: { label: { name: "Critical", color: "#DC2626" } },
      headers: headers(@member),
      as: :json

    assert_response :success
    assert_equal "Critical", @label.reload.name
  end

  def test_update_rejects_label_from_other_board
    other_board = create(:board, owner: @owner)
    other_label = create(:label, board: other_board, name: "Other")

    patch api_v1_board_label_path(@board.slug, other_label),
      params: { label: { name: "Updated" } },
      headers: headers(@owner),
      as: :json

    assert_response :not_found
    assert_equal "Other", other_label.reload.name
  end

  def test_update_rejects_non_member
    patch api_v1_board_label_path(@board.slug, @label),
      params: { label: { name: "Critical" } },
      headers: headers(@other_user),
      as: :json

    assert_response :not_found
    assert_equal "Bug", @label.reload.name
  end

  def test_destroy_deletes_label_for_owner
    assert_difference -> { Label.count }, -1 do
      delete api_v1_board_label_path(@board.slug, @label),
        headers: headers(@owner),
        as: :json
    end

    assert_response :success
    assert_equal I18n.t("successfully_deleted", count: 1, entity: "Label"), response_body["notice"]
  end

  def test_destroy_allows_board_member
    create(:board_member, board: @board, user: @member)

    assert_difference -> { Label.count }, -1 do
      delete api_v1_board_label_path(@board.slug, @label),
        headers: headers(@member),
        as: :json
    end

    assert_response :success
  end

  def test_destroy_rejects_label_from_other_board
    other_board = create(:board, owner: @owner)
    other_label = create(:label, board: other_board, name: "Other")

    assert_no_difference -> { Label.count } do
      delete api_v1_board_label_path(@board.slug, other_label),
        headers: headers(@owner),
        as: :json
    end

    assert_response :not_found
    assert Label.exists?(other_label.id)
  end

  def test_destroy_rejects_non_member
    assert_no_difference -> { Label.count } do
      delete api_v1_board_label_path(@board.slug, @label),
        headers: headers(@other_user),
        as: :json
    end

    assert_response :not_found
    assert Label.exists?(@label.id)
  end
end
