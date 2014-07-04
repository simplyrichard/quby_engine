require 'spec_helper'

feature 'Large questionnaires' do
  scenario 'should be fast to build from DSL' do
    questionnaire = Quby::Questionnaires::DSL.build('vlq') do
      title 'VLQ'

      (1..200).each do |i|
        question :"v_#{i}", type: :radio do
          title "Question #{i}"
          (1..10).each do |j|
            option :"a#{j}", value: j, description: "Q#{i} Option #{j}"
          end
        end
      end
    end
  end
end
