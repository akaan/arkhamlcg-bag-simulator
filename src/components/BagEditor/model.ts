import { Reducer } from "@cycle/state";
import { Token } from "arkham-odds";
import xs, { Stream } from "xstream";
import { AvailableBags } from "../../constants";
import { State as TokenCount } from "../TokenCountEditor";

export interface State {
  selectedBag: string | null;
  tokensInBag: TokenCount[];
}

const defaultState: State = {
  selectedBag: null,
  tokensInBag: []
};

export interface Actions {
  selectedBag$: Stream<string | null>;
}

export function model(
  actions: Actions,
  tokenCountEditorStates: Array<Stream<Reducer<State>>>
): Stream<Reducer<State>> {
  const defaultReducer$: Stream<Reducer<State>> = xs.of(function defaultReducer(
    prevState: State | undefined
  ): State | undefined {
    if (prevState != null) {
      return prevState;
    } else {
      return defaultState;
    }
  });

  const changeBagComposition$: Stream<
    Reducer<State>
  > = actions.selectedBag$.map(
    (newBagValue: string | null) =>
      function changeBagComposition(
        prevState: State | undefined
      ): State | undefined {
        if (prevState === undefined) {
          return prevState;
        }

        if (newBagValue === null) {
          return {
            ...prevState,
            selectedBag: null
          };
        } else {
          const bagToTokens = AvailableBags.find(
            ([bagLabel, _tokens]) => bagLabel === newBagValue
          );
          if (bagToTokens === undefined) {
            return {
              ...prevState,
              selectedBag: null
            };
          } else {
            return {
              ...prevState,
              selectedBag: newBagValue,
              tokensInBag: fromTokens(bagToTokens[1])
            };
          }
        }
      }
  );

  return xs.merge(
    defaultReducer$,
    changeBagComposition$,
    ...tokenCountEditorStates
  );
}

export function fromTokens(tokens: Token[]): TokenCount[] {
  return tokens.reduce(
    (acc: TokenCount[], token: Token) => {
      return acc.map(tokenCount => {
        if (tokenCount.tokenFace === token) {
          return { ...tokenCount, count: tokenCount.count + 1 };
        } else {
          return tokenCount;
        }
      });
    },
    [
      { tokenFace: Token.ELDER_SIGN, count: 0 },
      { tokenFace: Token.PLUS_ONE, count: 0 },
      { tokenFace: Token.ZERO, count: 0 },
      { tokenFace: Token.MINUS_ONE, count: 0 },
      { tokenFace: Token.MINUS_TWO, count: 0 },
      { tokenFace: Token.MINUS_THREE, count: 0 },
      { tokenFace: Token.MINUS_FOUR, count: 0 },
      { tokenFace: Token.MINUS_FIVE, count: 0 },
      { tokenFace: Token.MINUS_SIX, count: 0 },
      { tokenFace: Token.MINUS_SEVEN, count: 0 },
      { tokenFace: Token.MINUS_EIGHT, count: 0 },
      { tokenFace: Token.SKULL, count: 0 },
      { tokenFace: Token.CULTIST, count: 0 },
      { tokenFace: Token.TABLET, count: 0 },
      { tokenFace: Token.ELDER_THING, count: 0 },
      { tokenFace: Token.AUTOFAIL, count: 0 }
    ] as TokenCount[]
  );
}
