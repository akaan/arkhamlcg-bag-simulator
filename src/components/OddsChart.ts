import { div, VNode } from "@cycle/dom";
import { Bag, OddsFn, OutcomeFunction, TokenEffects } from "arkham-odds";
import { Stream } from "xstream";
import { PullProtocol } from "../constants";
import { ChartRequests } from "../drivers/highchartsDriver";

interface BagEffectsAndProtocol {
  bag: Bag;
  effects: TokenEffects;
  protocol: PullProtocol;
}

export interface Props {
  skillMinusDifficultyRange: number[];
  bagEffectsAndProtocol: BagEffectsAndProtocol;
}

interface Sources {
  props$: Stream<Props>;
}

interface Sinks {
  DOM: Stream<VNode>;
  charts: Stream<ChartRequests>;
}

export function OddsChart(sources: Sources): Sinks {
  const chartRequests$: Stream<ChartRequests> = sources.props$.map(props => {
    const series = [
      makeSerie(
        "Unsaved",
        props.skillMinusDifficultyRange,
        props.bagEffectsAndProtocol
      )
    ];

    return {
      "odds-chart": makeChart(props.skillMinusDifficultyRange, series)
    } as ChartRequests;
  });

  return {
    DOM: view(sources.props$),
    charts: chartRequests$
  };
}

function view(props$: Stream<Props>) {
  return props$.map(_props => div("#odds-chart"));
}

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
