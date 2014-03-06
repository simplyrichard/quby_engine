module Quby
  class FiltersAnswerValue
    def initialize(questionnaire)
      @questionnaire = questionnaire
    end

    def filter(attributes)
      attributes.keep_if do |key, value|
        valid_attribute_keys.include? key
      end
    end

    private

    def valid_attribute_keys
      @valid_attribute_keys ||= %w(aborted) +
                                @questionnaire.answer_keys.map(&:to_s)
    end
  end
end
