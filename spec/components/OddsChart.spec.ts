import {
  Bag,
  DefaultTokenEffects,
  odds,
  success,
  Token,
  TokenEffects
} from "arkham-odds";
import { expect } from "chai";
import "mocha";
import xs from "xstream";
import { OddsChart, Props } from "../../src/components/OddsChart";

describe("OddsChart", () => {
  it("renders an empty placeholder for the chart", () => {
    const sinks = OddsChart({
      props$: xs.of({
        skillMinusDifficultyRange: [],
        bagAndEffects: { bag: new Bag([]), effects: new TokenEffects([]) }
      } as Props)
    });

    sinks.DOM.subscribe({
      next: vtree => {
        expect(vtree.sel).to.equal("div#odds-chart");
      }
    });
  });

  it("streams chart requests based on props", () => {
    const range = [-2, -1, 0, 1];
    const effects = DefaultTokenEffects;

    const propsStreamValues: Props[] = [
      [Token.MINUS_ONE, Token.ZERO, Token.PLUS_ONE],
      [Token.MINUS_ONE, Token.ZERO, Token.PLUS_ONE],
      [Token.MINUS_ONE, Token.ZERO, Token.PLUS_ONE]
    ].map(tokens => ({
      skillMinusDifficultyRange: range,
      bagAndEffects: {
        bag: new Bag(tokens),
        effects
      }
    }));

    const expected = propsStreamValues.map(props => {
      return range.map(
        d =>
          100 *
          odds(
            1,
            props.bagAndEffects.bag,
            props.bagAndEffects.effects,
            success(d)
          )
      );
    });

    const sinks = OddsChart({
      props$: xs.of(...propsStreamValues)
    });

    sinks.charts.subscribe({
      next: req => {
        expect(
          (req["odds-chart"].series as Highcharts.SeriesLineOptions[])[0].data
        ).to.deep.equal(expected.shift());
      }
    });
  });
});
