# frozen_string_literal: true

class Api::V1::ChecklistItemsController < ApplicationController
  after_action :verify_authorized

  before_action :load_card, only: %i[create bulk_delete]
  before_action :load_checklist_item, only: %i[update destroy]

  def create
    checklist_item = @card.checklist_items.build(checklist_item_params)
    authorize checklist_item
    checklist_item.save!
    render_notice(t("successfully_created", entity: "Checklist item"), :ok)
  end

  def bulk_delete
    checklist_item = ChecklistItem.new(card: @card)
    authorize checklist_item, :bulk_delete?
    deleted_count = @card.checklist_items.destroy_all.size
    render_notice(t("successfully_deleted", count: deleted_count, entity: "Checklist item"))
  end

  def update
    authorize @checklist_item
    @checklist_item.update!(checklist_item_params)
    render_notice(t("successfully_updated", entity: "Checklist item"), :ok)
  end

  def destroy
    authorize @checklist_item
    @checklist_item.destroy!
    render_notice(t("successfully_deleted", count: 1, entity: "Checklist item"))
  end

  private

    def load_card
      @card = Card.joins(list: :board).merge(policy_scope(Board)).find(params[:card_id])
    end

    def load_checklist_item
      @checklist_item = ChecklistItem.joins(card: { list: :board })
        .merge(policy_scope(Board))
        .find(params[:id])
    end

    def checklist_item_params
      params.require(:checklist_item).permit(:text, :is_complete)
    end
end
