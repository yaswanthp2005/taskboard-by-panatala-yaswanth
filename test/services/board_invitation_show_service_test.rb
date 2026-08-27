# frozen_string_literal: true

require "test_helper"

class BoardInvitationShowServiceTest < ActiveSupport::TestCase
  include ActionMailer::TestHelper

  def setup
    @owner = create(:user, first_name: "Oliver", last_name: "Smith")
    @invitee = create(:user, email: "invitee@example.com")
    @other_user = create(:user)
    @board = create(:board, name: "Product Roadmap", owner: @owner)
    @invitation = create(:board_invitation, board: @board, inviter: @owner, invitee: @invitee)
  end

  def test_process_returns_pending_invitation_without_sending_email
    assert_emails 0 do
      invitation = BoardInvitationShowService.new(
        token: @invitation.token,
        user: @invitee
      ).process!

      assert_equal @invitation, invitation
    end
  end

  def test_process_rejects_wrong_user
    service = BoardInvitationShowService.new(token: @invitation.token, user: @other_user)

    assert_raises BoardInvitationShowService::Error do
      service.process!
    end
  end
end
