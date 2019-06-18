import { Reducer } from "@cycle/state";
import { Token } from "arkham-odds";
import xs, { Stream } from "xstream";
import { AvailableBags } from "../../constants";
import { State as TokenCount } from "../TokenCountEditor";
import { tokensToTokenCount } from "./tokensToTokenCount";

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
              tokensInBag: tokensToTokenCount(bagToTokens[1])
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
