class MigrateAnswersToMongo < ActiveRecord::Migration
  class OldAnswer < ActiveRecord::Base
    set_table_name "answers"
    serialize :value
  end

  def up
    quest_id = nil
    OldAnswer.find_each do |answer|
      if answer.questionnaire_id != quest_id
        quest_id = answer.questionnaire_id
        puts "Processing answers for #{answer.questionnaire_id}"
      end
      Answer.create!(:_id => answer.id,
                     :questionnaire_id => answer.questionnaire_id,
                     :patient_id => answer.patient_id,
                     :active => answer.active,
                     :test => answer.test,
                     :created_at => answer.created_at,
                     :updated_at => answer.updated_at,
                     :value => answer.value,
                     :token => answer.token)
    end
  end

  def down
    Answer.delete_all
  end
end