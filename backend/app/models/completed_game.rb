# frozen_string_literal: true

class CompletedGame < ApplicationRecord
  belongs_to :user
  scope :high_scores, -> { order(score: :desc).first(10) }
end
