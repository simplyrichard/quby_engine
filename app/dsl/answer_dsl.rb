module AnswerDsl
  def self.enhance(target_instance)
    answer = target_instance
    questionnaire = target_instance.questionnaire
    
    answer.class_eval do
      questionnaire.questions.each do |question|
        define_method(question.key) do
          self.value ||= Hash.new
          self.value[question.key]
        end

        define_method(question.key.to_s + "=") do |v|
          self.value ||= Hash.new
          self.value[question.key] = v
        end
      end
      
      questionnaire.scores.each do |score|
        scorer = score.scorer
        define_method("score_" + score.key.to_s, &scorer)
      end
    end
  end
end