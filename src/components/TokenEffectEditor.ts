import {
  DOMSource,
  MockedDOMSource,
  option,
  select,
  td,
  tr,
  VNode
} from "@cycle/dom";
import { Reducer } from "@cycle/state";
import {
  Autofail,
  Autosuccess,
  Modifier,
  Token,
  TokenEffect
} from "arkham-odds";
import xs, { Stream } from "xstream";
import { Sinks, Sources } from "../interfaces";

export interface State {
  tokenFace: Token;
  effect: TokenEffect;
}

interface Intent {
  effectSelected$: Stream<TokenEffect>;
}

export function TokenEffectEditor(sources: Sources<State>): Sinks<State> {
  const { effectSelected$ } = intent(sources.DOM);

  return {
    DOM: view(sources.state.stream),
    state: model(effectSelected$)
  };
}

function intent(DOM: DOMSource | MockedDOMSource): Intent {
  // https://github.com/cyclejs/cyclejs/issues/869
  if (DOM instanceof MockedDOMSource) {
    return {
      effectSelected$: DOM.select(".select-effect")
        .events("change")
        .map((event: Event) => (event.target as HTMLInputElement).value)
        .map(toTokenEffect)
    };
  } else {
    return {
      effectSelected$: DOM.select(".select-effect")
        .events("change")
        .map(event => (event.target as HTMLInputElement).value)
        .map(toTokenEffect)
    };
  }
}

function model(effectSelected$: Stream<TokenEffect>): Stream<Reducer<State>> {
  const defaultReducer$ = xs.of(function defaultReducer(
    prevState: State | undefined
  ): State | undefined {
    if (prevState != null) {
      return prevState;
    } else {
      return {
        tokenFace: Token.AUTOFAIL,
        effect: new Autofail()
      };
    }
  });

  const reducers$ = effectSelected$.map(
    newTokenEffect =>
      function changeTokenEffect(
        prevState: State | undefined
      ): State | undefined {
        if (prevState == null) {
          throw new Error("changeTokenEffect: got undefined state");
        }
        return {
          ...prevState,
          effect: newTokenEffect
        };
      }
  );

  return xs.merge(defaultReducer$, reducers$);
}

function view(state$: Stream<State>): Stream<VNode> {
  return state$.map(state => {
    return tr(".token-effect-editor", [
      td(state.tokenFace),
      td(".controls", [
        select(
          ".select-effect",
          { attrs: { value: toLabel(state.effect) } },
          tokenEffectOptions.map(stringEffect =>
            option(
              {
                attrs: {
                  value: stringEffect,
                  selected: stringEffect === toLabel(state.effect)
                }
              },
              stringEffect
            )
          )
        )
      ])
    ]);
  });
}

const tokenEffectOptions = [
  "Autosuccess",
  "+2",
  "+1",
  "0",
  "-1",
  "-2",
  "-3",
  "-4",
  "-5",
  "-6",
  "-7",
  "-8",
  "Autofail"
];

function toLabel(tokenEffect: TokenEffect): string {
  if (tokenEffect instanceof Autosuccess) {
    return "Autosuccess";
  } else if (tokenEffect instanceof Autofail) {
    return "Autofail";
  } else if (tokenEffect instanceof Modifier) {
    const modifier = tokenEffect as Modifier;
    if (modifier.getValue() > 0) {
      return `+${modifier.getValue()}`;
    } else {
      return String(modifier.getValue());
    }
  } else {
    throw new Error(`unknown TokenEffect ${tokenEffect}`);
  }
}

function toTokenEffect(stringValue: string): TokenEffect {
  if (stringValue === "Autosuccess") {
    return new Autosuccess();
  } else if (stringValue === "Autofail") {
    return new Autofail();
  } else {
    const modifier = parseInt(stringValue, 10);
    if (!isNaN(modifier)) {
      return new Modifier(modifier);
    } else {
      throw new Error(`unable to parse ${stringValue} as an effect`);
    }
  }
}
