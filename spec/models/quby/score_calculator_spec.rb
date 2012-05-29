require "spec_helper"

module Quby
  describe ScoreCalculator do
    describe '.calculate' do
      it 'calculates the value of a block' do
        score = stub
        calculator = ScoreCalculator.calculate({}) { score }.should == score
      end
    end

    describe '#initialize' do
      it 'stores values passed' do
        calculator = ScoreCalculator.new({'v_1' => 1})
        calculator.values.should == {'v_1' => 1}
      end
    end

    describe '#values' do
      let(:values) { {'v_1' => 1, 'v_2' => 4, 'v_3' => nil} }
      let(:calculator) { ScoreCalculator.new(values) }

      it 'returns the values hash if no args given' do
        calculator.values.should == values
      end

      it 'returns an array of values if args given' do
        calculator.values(:v_1, :v_2).should == [values['v_1'], values['v_2']]
      end

      it 'finds values by string' do
        calculator.values('v_1').should == [values['v_1']]
      end

      it 'raises if a value is requested which does not exist' do
        expect do
          calculator.values(:unknown_key)
        end.to raise_error(/unknown_key/)
      end
    end

    describe '#values_with_nils' do
      let(:values) { {'v_1' => 1, 'v_2' => 4, 'v_3' => nil} }
      let(:calculator) { ScoreCalculator.new(values) }

      it 'returns the values hash if no args given' do
        calculator.values_with_nils.should == values
      end

      it 'returns an array of values if args given' do
        calculator.values_with_nils(:v_1, :v_2).should == [values['v_1'], values['v_2']]
      end

      it 'finds values by string' do
        calculator.values_with_nils('v_1').should == [values['v_1']]
      end

      it 'returns nil if a value is requested which is not filled in' do
        calculator.values_with_nils(:v_3).should  == [nil]
      end
    end

    describe '#sum' do
      let(:calculator) { ScoreCalculator.new({}) }

      it 'sums values given' do
        calculator.sum([1, 2, 3, 4]).should == 10
      end

      it 'sums no values' do
        calculator.sum([]).should == 0
      end

      it 'raises for nil values' do
        expect { calculator.sum([nil, 2]) }.to raise_error(/coerce/)
      end
    end

    describe '#age' do
      it 'returns the age' do
        calculator = ScoreCalculator.new({}, {birthyear: 42.years.ago.year})
        calculator.age.should == 42
      end

      it 'returns the age when passed a string key' do
        calculator = ScoreCalculator.new({}, {"birthyear" => 42.years.ago.year})
        calculator.age.should == 42
      end
    end

    describe '#gender' do
      it 'returns the gender' do
        calculator = ScoreCalculator.new({}, {gender: :male})
        calculator.gender.should == :male
      end

      it 'returns the gender when passed a string key' do
        calculator = ScoreCalculator.new({}, {"gender" => :male})
        calculator.gender.should == :male
      end

      it 'returns :unknown when gender is not given' do
        calculator = ScoreCalculator.new({}, {})
        calculator.gender.should == :unknown
      end
    end

    describe '#require_percentage_filled' do
      let(:calculator) { ScoreCalculator.new({}) }

      context 'when enough values are non-nil' do
        it 'returns the values' do
          calculator.require_percentage_filled([1, 2, 3, 4, 5, 6], 100).should == [1,2,3,4,5,6]
        end

        it 'filters nils' do
          calculator.require_percentage_filled([1,2,nil], 20).should == [1,2]
        end

        it 'works with float percentages 0..1' do
          calculator.require_percentage_filled([1,2,nil], 0.2).should == [1,2]
        end
      end

      context 'when not enough values are non-nil' do
        it 'raises' do
          expect {
            calculator.require_percentage_filled([1, nil, nil, nil], 50)
          }.to raise_error("Needed at least 50.0% answered, got 25.0%")
        end
      end
    end
  end
end
