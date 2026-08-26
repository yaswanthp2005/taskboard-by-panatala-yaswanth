# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pagy::Method
  include ActivityRecordable
  include ApiResponders
  include ApiExceptions
  include Authenticable
  include Paginatable
  include Pundit::Authorization
end
