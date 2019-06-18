import { button, div, td, tr, VNode } from "@cycle/dom";
import { Stream } from "xstream";
import { State } from ".";

export function view(state$: Stream<State>): Stream<VNode> {
  return state$.map(state => {
    return tr(".token-count-editor", [
      td(state.tokenFace),
      td(state.count),
      td([div(".controls", [button(".add", ["+"]), button(".remove", ["-"])])])
    ]);
  });
}
