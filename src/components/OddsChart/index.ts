import { VNode } from "@cycle/dom";
import { Bag, TokenEffects } from "arkham-odds";
import { Stream } from "xstream";
import { PullProtocol } from "../../constants";
import { ChartRequests } from "../../drivers/highchartsDriver";
import { chartRequests } from "./chartRequests";
import { view } from "./view";

export interface BagEffectsAndProtocol {
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
  return {
    DOM: view(sources.props$),
    charts: chartRequests(sources.props$)
  };
}
