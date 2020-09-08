class UsersController < ApplicationController
  def show
  end

  def create
    user = User.find_or_create_by(user_params)
    render json: user
  end

  private
  def user_params
    params.require(:user).permit(:name)
  end
end
