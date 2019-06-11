import { DOMSource, MockedDOMSource, VNode } from "@cycle/dom";
import { Reducer, StateSource } from "@cycle/state";
import { Stream } from "xstream";
import { ChartRequests } from "./drivers/highchartsDriver";

export type Component<State> = (sources: Sources<State>) => Sinks<State>;

export interface Sources<State> {
  DOM: DOMSource | MockedDOMSource; // https://github.com/cyclejs/cyclejs/issues/869
  state: StateSource<State>;
}

export interface Sinks<State> {
  DOM: Stream<VNode>;
  state: Stream<Reducer<State>>;
  charts?: Stream<ChartRequests>;
}
