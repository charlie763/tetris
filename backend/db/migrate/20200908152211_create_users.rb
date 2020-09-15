# frozen_string_literal: true

# Model representing a tetris user
class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :name
      t.text :last_game
      t.string :high_score

      t.timestamps
    end
  end
end
