import { Reducer } from "@cycle/state";
import xs, { Stream } from "xstream";
import {
  AvailableCardAbilities,
  PullProtocol,
  StandardPullProtocol
} from "../../constants";

export interface State {
  abilitySelected: string;
  protocol: PullProtocol;
}

const defaultState: State = {
  abilitySelected: "None",
  protocol: StandardPullProtocol
};

export interface Actions {
  newAbilitySelected$: Stream<string>;
}

const defaultReducer$ = xs.of<Reducer<State>>(prevState => {
  if (prevState != null) {
    return prevState;
  } else {
    return defaultState;
  }
});

function lookupAbilityWithDefault(
  abilityLabel: string
): [string, PullProtocol] {
  return (
    AvailableCardAbilities.find(([l, _]) => l === abilityLabel) || [
      "None",
      StandardPullProtocol
    ]
  );
}

export function model(actions: Actions): Stream<Reducer<State>> {
  const changeAbilityReducer$: Stream<
    Reducer<State>
  > = actions.newAbilitySelected$.map(lookupAbilityWithDefault).map(
    ([abilityLabel, protocol]) =>
      function changeAbility(_prevState: State | undefined): State | undefined {
        return {
          abilitySelected: abilityLabel,
          protocol
        };
      }
  );

  return xs.merge(defaultReducer$, changeAbilityReducer$);
}
