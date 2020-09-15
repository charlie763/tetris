# frozen_string_literal: true

Rails.application.routes.draw do
  resources :completed_games, only: %i[index create]
  resources :users, only: %i[show create update]
end
