# frozen_string_literal: true

# Controller for the CompletedGame model. Serves up JSON to be used by frontend.
class CompletedGamesController < ApplicationController
  def index
    games = CompletedGame.high_scores
    render json: games, only: [:score], include: { user: { only: [:name] } }
  end

  def create
    CompletedGame.create(game_params)
    render json: { message: 'game recieved' }
  end

  private

  def game_params
    params.require(:completed_game).permit(:score, :user_id)
  end
end
