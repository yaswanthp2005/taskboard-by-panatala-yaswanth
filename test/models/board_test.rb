# frozen_string_literal: true

require "test_helper"

class BoardTest < ActiveSupport::TestCase
  def setup
    @owner = create(:user)
    @board = build(:board, owner: @owner)
  end

  def test_is_valid
    assert @board.valid?
  end

  def test_is_invalid_without_name
    @board.name = nil

    assert_not @board.valid?
    assert_includes @board.errors[:name], "can't be blank"
  end

  def test_is_invalid_without_owner
    @board.owner = nil

    assert_not @board.valid?
    assert_includes @board.errors[:owner], "must exist"
  end

  def test_generates_slug_from_name
    board = create(:board, name: "Product Roadmap", owner: @owner)

    assert_equal "product-roadmap", board.slug
  end

  def test_generates_unique_slug_for_duplicate_names
    create(:board, name: "Product Roadmap", owner: @owner)
    duplicate_name_board = create(:board, name: "Product Roadmap", owner: @owner)

    assert_equal "product-roadmap-2", duplicate_name_board.slug
  end

  def test_slug_cannot_be_changed_after_creation
    board = create(:board, owner: @owner)
    board.slug = "changed-slug"

    assert_not board.valid?
    assert_includes board.errors.full_messages, "Slug #{I18n.t('board.slug.immutable')}"
  end

  def test_belongs_to_owner
    assert_equal @owner, @board.owner
  end

  def test_has_no_members_on_create
    board = create(:board, owner: @owner)

    assert_empty board.members
  end
end
