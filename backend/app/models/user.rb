class User < ApplicationRecord
  has_many :completed_games
  validates :name, presence: true 
end
