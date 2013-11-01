# -*- coding: utf-8 -*-
require 'spec_helper'

module Quby
  describe AnswersController do
    def create_answer(questionnaire)
      Quby.questionnaire_finder
        .stub(:find)
        .with(questionnaire.key)
        .and_return(questionnaire)

      Quby::Answer.create(questionnaire_key: questionnaire.key)
    end

    describe '#update' do
      before do
        AnswersController.any_instance.stub(verify_hmac: true)
        AnswersController.any_instance.stub(verify_token: true)
      end

      it 'saves the answer' do
        honos  = Questionnaire.new("honos", "question(:v1, type: :string)")
        answer = create_answer(honos)
        put "/quby/questionnaires/honos/answers/#{answer.id}", answer: {v_1: nil}

        response.should render_template(:completed)
      end

      it 'does not save invalid answers' do
        honos  = Questionnaire.new("honos", "question(:v1, type: :string, required: true)")
        answer = create_answer(honos)
        put "/quby/questionnaires/honos/answers/#{answer.id}", answer: {v_1: nil}

        response.should render_template(:edit)
        flash[:notice].should match(/nog niet volledig ingevuld/)
      end

      context 'upon successful save' do
        let(:honos)      { Questionnaire.new("honos", "question(:v1, type: :string)") }
        let(:answer)     { create_answer(honos) }
        let(:url)        { "http://example.org" }
        let(:return_url) { url + "?key=abcd&return_from=quby&return_from_answer=#{answer.id}" }

        it 'renders print view if printing' do
          put "/quby/questionnaires/honos/answers/#{answer.id}/print", answer: {v_1: nil}
          response.should render_template('print/show')
        end

        it 'renders completed view if no return url' do
          put "/quby/questionnaires/honos/answers/#{answer.id}", answer: {v_1: nil}
          response.should render_template('completed')
        end

        it 'redirects to roqua if return url is set' do
          put "/quby/questionnaires/honos/answers/#{answer.id}",
              answer: {v_1: nil},
              return_url: url,
              return_token: "abcd"

          response.should redirect_to(return_url)
        end

        it 'respects existing query parameters in return url' do
          put "/quby/questionnaires/honos/answers/#{answer.id}",
              answer: {v_1: nil},
              return_url: url + "?a=b",
              return_token: "abcd"

          response.should redirect_to(url + "?a=b&key=abcd&return_from=quby&return_from_answer=#{answer.id}")
        end

        it 'redirects with status of "close" if abort button was clicked' do
          put "/quby/questionnaires/honos/answers/#{answer.id}",
              answer: {v_1: nil},
              return_url: url,
              return_token: "abcd",
              commit: "Onderbreken"

          response.should redirect_to(return_url + "&status=close")
        end

        it 'redirects with status of "back" when a user navigates back' do
          put "/quby/questionnaires/honos/answers/#{answer.id}",
              answer: {v_1: nil},
              return_url: url,
              return_token: "abcd",
              commit: "← Vorige vragenlijst"

          response.should redirect_to(return_url + "&status=back")
        end
      end
    end
  end
end