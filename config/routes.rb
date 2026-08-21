# frozen_string_literal: true

Rails.application.routes.draw do

  constraints(lambda { |req| req.format == :json }) do
    namespace :api do
      namespace :v1 do
        resources :users, only: :create
        resource :session, only: :create
        resources :boards, only: %i[index show create update destroy], param: :slug do
          resources :members, only: :create, controller: "board_members"
          resources :lists, only: :update do
            resources :cards, only: %i[create show update], shallow: true
          end
        end
      end
    end
  end

  root "home#index"
  get "*path", to: "home#index", via: :all, constraints: lambda { |req| !req.path.start_with?("/rails") }
end
