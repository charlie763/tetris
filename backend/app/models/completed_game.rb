# frozen_string_literal: true

# Model representing games a user has finished
class CompletedGame < ApplicationRecord
  belongs_to :user
  scope :high_scores, -> { order(score: :desc).first(10) }
end
