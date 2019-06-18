import { div } from "@cycle/dom";
import { Stream } from "xstream";
import { Props } from ".";

export function view(props$: Stream<Props>) {
  return props$.map(_props => div("#odds-chart"));
}
