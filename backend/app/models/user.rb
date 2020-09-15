# frozen_string_literal: true

# Model representing a tetris user
class User < ApplicationRecord
  has_many :completed_games
  validates :name, presence: true
end
