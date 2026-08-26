# frozen_string_literal: true

class Api::V1::LabelsController < ApplicationController
  after_action :verify_authorized

  before_action :load_board!
  before_action :load_label!, only: %i[update destroy]

  def index
    authorize Label
    labels = @board.labels.order(:name)
    @labels = paginate(labels)
  end

  def create
    label = @board.labels.build(label_params)
    authorize label
    label.save!
    render_notice(t("successfully_created", entity: t("entities.label")), :ok)
  end

  def update
    authorize @label
    @label.update!(label_params)
    render_notice(t("successfully_updated", entity: t("entities.label")), :ok)
  end

  def destroy
    authorize @label
    @label.destroy!
    render_notice(t("successfully_deleted", count: 1, entity: t("entities.label")))
  end

  private

    def load_board!
      @board = policy_scope(Board).find_by!(slug: params[:board_slug])
    end

    def load_label!
      @label = @board.labels.find(params[:id])
    end

    def label_params
      params.require(:label).permit(:name, :color)
    end
end
