require 'spec_helper'

module Quby::Questionnaires::DSL
  describe BarChartBuilder do
    it_behaves_like ChartBuilder

    let(:questionnaire) { double(key: 'questionnaire_key') }

    it 'makes a bar chart' do
      expect(dsl { }).to be_an_instance_of(::Quby::Questionnaires::Entities::Charting::BarChart)
    end

    def dsl(key = :test, options = {}, &block)
      builder = BarChartBuilder.new(questionnaire, key, options)
      builder.build(&block)
    end

    it 'sets y-axis range' do
      expect(dsl { range 0..40 }.y_range).to eq (0..40)
    end

    it 'sets y-axis tick interval' do
      expect(dsl { tick_interval 1 }.tick_interval).to eq 1
    end

  end
end
