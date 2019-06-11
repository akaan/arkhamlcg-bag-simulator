import { expect } from "chai";
import "mocha";
import xs from "xstream";
import { OddsChart, Props } from "../../src/components/OddsChart";

describe("OddsChart", () => {
  it("renders an empty placeholder for the chart", () => {
    const sinks = OddsChart({
      props$: xs.of({ computedOdds: [] } as Props)
    });

    sinks.DOM.subscribe({
      next: vtree => {
        expect(vtree.sel).to.equal("div#odds-chart");
      }
    });
  });

  it("streams chart requests based on props", () => {
    const propsStreamValues = [
      [[-1, 20], [0, 50], [1, 75]],
      [[-1, 15], [0, 40], [1, 60]],
      [[-1, 25], [0, 60], [1, 95]]
    ].map(serie => ({
      computedOdds: serie.map(([s, o]) => ({
        skillMinusDifficulty: s,
        odds: o
      }))
    }));

    const sinks = OddsChart({
      props$: xs.of(...propsStreamValues)
    });

    sinks.charts.subscribe({
      next: req => {
        expect(
          (req["odds-chart"].series as Highcharts.SeriesLineOptions[])[0].data
        ).to.deep.equal(
          propsStreamValues
            .shift()!
            .computedOdds.map(computedOdd => computedOdd.odds)
        );
      }
    });
  });
});
