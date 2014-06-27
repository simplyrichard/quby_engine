require 'quby/questionnaires/entities/charting/bar_chart'
require_relative 'chart_builder'

module Quby
  module DSL
    class BarChartBuilder < ChartBuilder
      set_chart_class(::Quby::Charting::BarChart)
    end
  end
end
