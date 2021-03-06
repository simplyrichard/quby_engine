require 'spec_helper'

module Quby::Questionnaires::Entities
  describe Fields do
    let(:key)           { 'test' }
    let(:definition) do
      %q~
        question :v_1, type: :check_box, title: 'select a few' do
          option :v_1_a1, description: 'select me' do
            question :v_1_a1_1, type: :string, title: 'why did you do that?'
          end
        end
        question :v_2, type: :radio, title: 'choose one' do
          option :a1, value: 1, description: 'me'
        end
      ~
    end
    let(:questionnaire) { Quby::Questionnaires::DSL.build(key, definition) }

    describe 'question_hash' do
      it 'contains all the questions by question_key' do
        expect(questionnaire.fields.question_hash[:v_1].title).to eq 'select a few'
        expect(questionnaire.fields.question_hash[:v_1_a1_1].title).to eq 'why did you do that?'
      end
    end

    describe 'option_hash' do
      it 'contains all the options by input_key' do
        expect(questionnaire.fields.option_hash[:v_1_a1].description).to eq 'select me'
        expect(questionnaire.fields.option_hash[:v_2_a1].description).to eq 'me'
      end
    end

    describe 'input_keys' do
      it 'contains all the used input_keys' do
        expect(questionnaire.fields.input_keys).to eq Set.new(%I( v_1_a1 v_1_a1_1 v_2_a1 ))
      end
    end

    describe 'answer_keys' do
      it 'contains all the used answer_keys' do
        expect(questionnaire.fields.answer_keys).to eq Set.new(%I( v_1_a1 v_1_a1_1 v_2 ))
      end
    end
  end
end
