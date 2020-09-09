Rails.application.routes.draw do
  resources :completed_games
  resources :users, only: [:show, :create, :update]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
