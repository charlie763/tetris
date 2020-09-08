class UsersController < ApplicationController
  def show
  end

  def create
    user = User.find_or_create_by(name: user_params[:name])
    user.last_game = user_params[:last_game]
    user.save
    render json: user
  end

  private
  def user_params
    params.require(:user).permit(:name, :last_game)
  end
end
