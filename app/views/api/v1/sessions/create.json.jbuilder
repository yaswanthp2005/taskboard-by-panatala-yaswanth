# frozen_string_literal: true

json.extract! @user, :id, :first_name, :last_name, :email, :authentication_token
json.pending_invitation_token @pending_invitation_token
