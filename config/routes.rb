# frozen_string_literal: true

Rails.application.routes.draw do

  constraints(lambda { |req| req.format == :json }) do
    namespace :api do
      namespace :v1 do
        resources :users, only: :create
        resource :session, only: %i[create destroy]
        resources :boards, only: %i[index show create update destroy], param: :slug do
          resources :members, only: %i[index create], controller: "board_members"
          resources :activities, only: :index
          resources :labels, only: %i[index create update destroy]
          resources :cards, only: :index
          resources :lists, only: %i[create update destroy] do
            member do
              patch :move
            end
            resources :cards, only: %i[create show update destroy], shallow: true do
              member do
                patch :move
              end
              resources :activities, only: :index
              resources :checklist_items, only: %i[create update destroy] do
                collection do
                  delete :bulk_delete
                end
              end
            end
          end
        end
      end
    end
  end

  root "home#index"
  get "*path", to: "home#index", via: :all, constraints: lambda { |req| !req.path.start_with?("/rails") }
end
