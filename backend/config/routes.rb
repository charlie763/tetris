Rails.application.routes.draw do
  resources :completed_games, only: [:index, :create]
  resources :users, only: [:show, :create, :update]
end
