import {
  div,
  DOMSource,
  label,
  MockedDOMSource,
  option,
  select,
  VNode
} from "@cycle/dom";
import { Reducer } from "@cycle/state";
import xs, { Stream } from "xstream";
import {
  AvailableCardAbilities,
  PullProtocol,
  StandardPullProtocol
} from "../constants";
import { Component } from "../interfaces";

export interface State {
  abilitySelected: string;
  protocol: PullProtocol;
}

interface Intent {
  newAbilitySelected$: Stream<string>;
}

export const PullProtocolSelector: Component<State> = sources => {
  const { newAbilitySelected$ } = intent(sources.DOM);

  return {
    DOM: view(sources.state.stream),
    state: model(newAbilitySelected$)
  };
};

function intent(DOM: DOMSource | MockedDOMSource): Intent {
  // https://github.com/cyclejs/cyclejs/issues/869
  if (DOM instanceof MockedDOMSource) {
    return {
      newAbilitySelected$: DOM.select("#select-protocol")
        .events("change")
        .map((event: Event) => (event.target as HTMLInputElement).value)
    };
  } else {
    return {
      newAbilitySelected$: DOM.select("#select-protocol")
        .events("change")
        .map(event => (event.target as HTMLInputElement).value)
    };
  }
}

function model(newAbilitySelected$: Stream<string>): Stream<Reducer<State>> {
  const defaultReducer$ = xs.of<Reducer<State>>(prevState => {
    if (prevState != null) {
      return prevState;
    } else {
      return {
        abilitySelected: "None",
        protocol: StandardPullProtocol
      };
    }
  });

  const changeAbilityReducer$: Stream<Reducer<State>> = newAbilitySelected$
    .map(lookupAbilityWithDefault)
    .map(
      ([abilityLabel, protocol]) =>
        function changeAbility(
          _prevState: State | undefined
        ): State | undefined {
          return {
            abilitySelected: abilityLabel,
            protocol
          };
        }
    );

  return xs.merge(defaultReducer$, changeAbilityReducer$);
}

function view(state$: Stream<State>): Stream<VNode> {
  return state$.map(state => {
    return div(".pull-protocol-selector", [
      label({ attrs: { for: "select-protocol" } }, "Choose a card ability :"),
      select(
        "#select-protocol",
        { attrs: { value: state.abilitySelected } },
        cardAbilitiesOptions(state)
      )
    ]);
  });
}

function cardAbilitiesOptions(state: State): VNode[] {
  return AvailableCardAbilities.map(([abilityLabel, _]) => {
    return option(
      {
        attrs: {
          value: abilityLabel,
          selected: state.abilitySelected === abilityLabel
        }
      },
      abilityLabel
    );
  });
}

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
