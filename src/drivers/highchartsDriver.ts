import Highcharts = require("highcharts");
import { Listener, Stream } from "xstream";
import delay from "xstream/extra/delay";

export interface ChartRequests {
  [target: string]: Highcharts.Options;
}

export function highchartsDriver(options$: Stream<ChartRequests>): void {
  // The delay is required so that the DOM element in which the chart will be
  // rendered is available (in the case the DOM and the chart request are
  // emitted simultaneously).
  options$.compose(delay(0)).subscribe(new HighchartsListener());
}

class HighchartsListener implements Listener<ChartRequests> {
  private _charts: { [target: string]: Highcharts.Chart } = {};

  // tslint:disable-next-line:no-empty
  public complete(): void {}

  // tslint:disable-next-line:no-empty
  public error(_err: any): void {}

  public next(requests: ChartRequests): void {
    Object.entries(requests).forEach(([target, options]) => {
      if (this._charts[target] != null) {
        this._charts[target].update(options);
      } else {
        this._charts[target] = Highcharts.chart(target, options);
      }
    });
  }
}
