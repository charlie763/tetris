# frozen_string_literal: true

ActiveRecord::Schema.define(version: 20_200_909_190_338) do
  create_table 'completed_games', force: :cascade do |t|
    t.integer 'score'
    t.integer 'user_id'
    t.datetime 'created_at', precision: 6, null: false
    t.datetime 'updated_at', precision: 6, null: false
  end

  create_table 'users', force: :cascade do |t|
    t.string 'name'
    t.text 'last_game'
    t.string 'high_score'
    t.datetime 'created_at', precision: 6, null: false
    t.datetime 'updated_at', precision: 6, null: false
  end
end
