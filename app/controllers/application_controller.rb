# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pagy::Method
  include ApiResponders
  include ApiExceptions
  include Authenticable
  include Pundit::Authorization
end
