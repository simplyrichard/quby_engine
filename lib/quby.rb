require "monkey_patches/virtus"
require "quby/engine"

$:.unshift(File.expand_path("../../app/dsl", __FILE__))
$:.unshift(File.expand_path("../../app/models", __FILE__))
$:.unshift(File.expand_path("../../app/repos", __FILE__))
$:.unshift(File.expand_path("../../app/services", __FILE__))

require 'quby/questionnaire_repos/disk_repo'
require 'quby/answer_repos'
require 'quby/outcome_calculation'

module Quby
  class << self
    # ==================================================================================================================
    #                     Quby configuration
    # ==================================================================================================================

    def questionnaires_path
      @questionnaires_path
    end

    def questionnaires_path=(new_path)
      @questionnaires_path  = new_path
      @questionnaire_finder = nil
      @questionnaires_api = nil
    end

    def show_exceptions
      @show_exceptions
    end

    def show_exceptions=(bool)
      @show_exceptions = bool
    end

    def answer_repo=(repo)
      @answer_repo = repo
      @answers_api = nil
    end

    def fixtures_path
      File.expand_path File.join('..', '..', 'spec', 'fixtures'), __FILE__
    end

    # ==================================================================================================================
    #                     Quby public API
    # ==================================================================================================================

    def answers
      @answers_api ||= Quby::Api::Answers.new answer_repo: Quby.send(:answer_repo)
    end

    def questionnaires
      @questionnaires_api ||= Quby::Api::Questionnaires.new questionnaire_repo: Quby.send(:questionnaire_finder)
    end

    # ==================================================================================================================
    #                     No more Quby public API, move along
    # ==================================================================================================================

    private

    def answer_repo
      @answer_repo || fail("Quby does not have its storage for answers (Quby.answer_repo) configured.")
    end

    def questionnaire_finder
      @questionnaire_finder ||= Quby::QuestionnaireRepos::DiskRepo.new(Quby.questionnaires_path)
    end
  end
end
