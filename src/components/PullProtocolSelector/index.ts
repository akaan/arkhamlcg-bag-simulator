import { Component } from "../../interfaces";
import { intent } from "./intent";
import { model, State } from "./model";
import { view } from "./view";

export type State = State;

export const PullProtocolSelector: Component<State> = sources => {
  const actions = intent(sources.DOM);

  return {
    DOM: view(sources.state.stream),
    state: model(actions)
  };
};
