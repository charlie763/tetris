# frozen_string_literal: true

class UsersController < ApplicationController
  def show
    user = User.find_by(id: params[:id])
    render json: user, except: %i[created_at updated_at]
  end

  def create
    user = User.find_or_create_by(name: user_params[:name])
    render json: user
  end

  def update
    user = User.find_by(id: params[:id])
    user.update(user_params)
    render json: user
  end

  private

  def user_params
    params.require(:user).permit(:name, :last_game)
  end
end
