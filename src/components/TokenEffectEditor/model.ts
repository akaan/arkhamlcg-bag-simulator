import { Reducer } from "@cycle/state";
import { Autofail, Token, TokenEffect } from "arkham-odds";
import xs, { Stream } from "xstream";

export interface State {
  tokenFace: Token;
  effect: TokenEffect;
}

const defaultState: State = {
  tokenFace: Token.AUTOFAIL,
  effect: new Autofail()
};

const defaultReducer$ = xs.of(function defaultReducer(
  prevState: State | undefined
): State | undefined {
  if (prevState != null) {
    return prevState;
  } else {
    return defaultState;
  }
});

export interface Actions {
  effectSelected$: Stream<TokenEffect>;
}

export function model(actions: Actions): Stream<Reducer<State>> {
  const reducers$ = actions.effectSelected$.map(
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
