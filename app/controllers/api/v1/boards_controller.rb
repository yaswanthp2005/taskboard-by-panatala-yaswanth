# frozen_string_literal: true

class Api::V1::BoardsController < ApplicationController
  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index

  def index
    authorize Board
    boards = policy_scope(Board).order(updated_at: :desc)
    @pagy, @boards = pagy(boards)
    @pagination = pagy_metadata(@pagy)
  end
end
