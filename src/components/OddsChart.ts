import { div, VNode } from "@cycle/dom";
import { Bag, TokenEffects } from "arkham-odds";
import * as Highcharts from "highcharts";
import { Stream } from "xstream";
import { PullProtocol } from "../constants";
import { ChartRequests } from "../drivers/highchartsDriver";

interface BagEffectsAndProtocol {
  title: string;
  bag: Bag;
  effects: TokenEffects;
  protocol: PullProtocol;
}

export interface Props {
  skillMinusDifficultyRange: number[];
  bagEffectsAndProtocols: BagEffectsAndProtocol[];
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
    const series = props.bagEffectsAndProtocols.map(bagEffectsAndProtocol =>
      makeSerie(
        bagEffectsAndProtocol.title,
        props.skillMinusDifficultyRange,
        bagEffectsAndProtocol
      )
    );

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
