import * as Highcharts from "highcharts";
import { Stream } from "xstream";
import { BagEffectsAndProtocol, Props } from ".";
import { ChartRequests } from "../../drivers/highchartsDriver";

function makeSerie(
  title: string,
  range: number[],
  config: BagEffectsAndProtocol
): Highcharts.SeriesLineOptions {
  return {
    name: title,
    type: "line",
    tooltip: {
      valueDecimals: 2,
      valueSuffix: "%"
    },
    data: range
      .sort((a, b) => a - b)
      .map(
        d =>
          100 *
          config.protocol.oddsFunction(
            config.protocol.numberOfTokensToPull,
            config.bag,
            config.effects,
            config.protocol.outcomeFunction(d)
          )
      )
  };
}

function makeChart(
  range: number[],
  series: Highcharts.SeriesLineOptions[]
): Highcharts.Options {
  return {
    title: { text: "Odds of success" },
    xAxis: {
      title: { text: "Skill - Difficulty" }
    },
    yAxis: {
      title: { text: "Odds of success" },
      labels: { format: "{value:.2f}%" },
      min: 0,
      max: 100
    },
    legend: { layout: "vertical", align: "right", verticalAlign: "middle" },
    plotOptions: {
      series: {
        label: { connectorAllowed: false },
        pointStart: range.sort((a, b) => a - b)[0]
      }
    },
    series,
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom"
            }
          }
        }
      ]
    }
  };
}

export function chartRequests(props: Stream<Props>): Stream<ChartRequests> {
  return props.map(p => {
    const series = p.bagEffectsAndProtocols.map(bagEffectsAndProtocol =>
      makeSerie(
        bagEffectsAndProtocol.title,
        p.skillMinusDifficultyRange,
        bagEffectsAndProtocol
      )
    );

    return {
      "odds-chart": makeChart(p.skillMinusDifficultyRange, series)
    } as ChartRequests;
  });
}
