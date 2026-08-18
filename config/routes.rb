# frozen_string_literal: true

Rails.application.routes.draw do

  constraints(lambda { |req| req.format == :json }) do
    namespace :api do
      namespace :v1 do
        resources :users, only: :create
        resource :session, only: :create
      end
    end
  end

  root "home#index"
  get "*path", to: "home#index", via: :all, constraints: lambda { |req| !req.path.start_with?("/rails") }
end
