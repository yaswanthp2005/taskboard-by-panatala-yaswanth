# frozen_string_literal: true

require "test_helper"

class MailerTest < ActionMailer::TestCase
  include ApplicationHelper
  def setup
    @owner = create(:user, first_name: "Oliver", last_name: "Smith", email: "owner@example.com")
    @invitee = create(:user, first_name: "Luna", last_name: "Smith", email: "invitee@example.com")
    @board = create(:board, name: "Product Roadmap", owner: @owner)
    @invitation = create(:board_invitation, board: @board, inviter: @owner, invitee: @invitee)
  end

  def test_board_member_invitation_email
    email = Mailer.board_member_invitation_email(@invitation.id, @owner.id)

    assert_equal [@invitee.email], email.to
    assert_equal I18n.t(
      "board_member.invitation_email.subject",
      board_name: @board.name,
      inviter_name: full_name(@owner)
    ), email.subject
    assert_includes email.body.encoded, @board.name
    assert_includes email.body.encoded, @invitation.token
  end
end
