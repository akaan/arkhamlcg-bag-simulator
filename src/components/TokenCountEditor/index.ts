import { Sinks, Sources } from "../../interfaces";
import { intent } from "./intent";
import { model, State } from "./model";
import { view } from "./view";

export type State = State;

export function TokenCountEditor(sources: Sources<State>): Sinks<State> {
  const actions = intent(sources.DOM);

  return {
    DOM: view(sources.state.stream),
    state: model(actions)
  };
}
