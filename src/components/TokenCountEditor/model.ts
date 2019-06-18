import { Reducer } from "@cycle/state";
import { Token } from "arkham-odds";
import xs, { Stream } from "xstream";

export interface State {
  tokenFace: Token;
  count: number;
}

const defaultState: State = {
  tokenFace: Token.AUTOFAIL,
  count: 0
};

export interface Actions {
  addOne$: Stream<any>;
  removeOne$: Stream<any>;
}

export function model(actions: Actions): Stream<Reducer<State>> {
  const init$ = xs.of(function defaultReducer(
    prevState: State | undefined
  ): State | undefined {
    if (prevState === undefined) {
      return defaultState;
    } else {
      return prevState;
    }
  });
  const addOneReducer$ = actions.addOne$.mapTo(function addOneReducer(
    prevState: State | undefined
  ): State | undefined {
    if (prevState == null) {
      throw new Error("addOneReducer: got undefined state");
    }
    return {
      ...prevState,
      count: prevState.count + 1
    };
  });
  const removeOneReducer$ = actions.removeOne$.mapTo(function removeOneReducer(
    prevState: State | undefined
  ): State | undefined {
    if (prevState == null) {
      throw new Error("removeOneReducer: got undefined state");
    }
    return {
      ...prevState,
      count: prevState.count <= 0 ? 0 : prevState.count - 1
    };
  });

  return xs.merge(init$, addOneReducer$, removeOneReducer$);
}
