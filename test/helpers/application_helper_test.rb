# frozen_string_literal: true

require "test_helper"

class ApplicationHelperTest < ActionView::TestCase
  include ApplicationHelper

  def user_signed_in?
    @signed_in
  end

  def current_user
    @current_user
  end

  def current_page?(path)
    @current_page_path == path
  end

  def test_full_name_joins_first_and_last_name
    user = build(:user, first_name: "Jane", last_name: "Doe")

    assert_equal "Jane Doe", full_name(user)
  end

  def test_get_client_props_returns_empty_hash
    assert_equal({}, get_client_props)
  end

  def test_super_admin_signed_in_when_user_is_super_admin
    @signed_in = true
    @current_user = build(:user)
    @current_user.define_singleton_method(:super_admin?) { true }

    assert super_admin_signed_in?
  end

  def test_super_admin_signed_in_when_user_is_not_super_admin
    @signed_in = true
    @current_user = build(:user)
    @current_user.define_singleton_method(:super_admin?) { false }

    assert_not super_admin_signed_in?
  end

  def test_nav_link_renders_link
    html = nav_link("Boards", "/boards")

    assert_includes html, "Boards"
    assert_includes html, 'href="/boards"'
  end

  def test_nav_link_marks_active_when_current_page
    @current_page_path = "/boards"
    html = nav_link("Boards", "/boards")

    assert_includes html, "active"
  end

  def test_nav_link_marks_active_when_condition_is_true
    html = nav_link("Boards", "/boards", true)

    assert_includes html, "active"
  end
end
