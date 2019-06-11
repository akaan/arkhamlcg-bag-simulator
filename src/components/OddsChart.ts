import { div, VNode } from "@cycle/dom";
import { Stream } from "xstream";
import { ChartRequests } from "../drivers/highchartsDriver";

interface ComputedOdds {
  skillMinusDifficulty: number;
  odds: number;
}

export interface Props {
  computedOdds: ComputedOdds[];
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
    const series: Highcharts.SeriesLineOptions[] = [
      {
        name: "Unsaved",
        type: "line",
        tooltip: {
          valueDecimals: 2,
          valueSuffix: "%"
        },
        data: props.computedOdds.map(computedOdd => computedOdd.odds)
      }
    ];
    const testChartOptions: Highcharts.Options = {
      title: { text: "Odds of success" },
      xAxis: {
        title: { text: "Skill - Difficulty" }
      },
      yAxis: {
        title: { text: "Odds of success" },
        labels: { format: "{value:.2f}%" }
      },
      legend: { layout: "vertical", align: "right", verticalAlign: "middle" },
      plotOptions: {
        series: {
          label: { connectorAllowed: false },
          dataLabels: { enabled: true, format: "{point.y:.2f}%" },
          pointStart: -4
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

    return {
      "odds-chart": testChartOptions
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
