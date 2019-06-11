import {
  button,
  div,
  DOMSource,
  MockedDOMSource,
  td,
  tr,
  VNode
} from "@cycle/dom";
import { Reducer } from "@cycle/state";
import { Token } from "arkham-odds";
import xs, { Stream } from "xstream";
import { Sinks, Sources } from "../interfaces";

export interface State {
  tokenFace: Token;
  count: number;
}

interface Intent {
  addOne$: Stream<null>;
  removeOne$: Stream<null>;
}

export function TokenCountEditor(sources: Sources<State>): Sinks<State> {
  const { addOne$, removeOne$ } = intent(sources.DOM);

  return {
    DOM: view(sources.state.stream),
    state: model(addOne$, removeOne$)
  };
}

function model(
  addOne$: Stream<any>,
  removeOne$: Stream<any>
): Stream<Reducer<State>> {
  const init$ = xs.of(function defaultReducer(
    prevState: State | undefined
  ): State | undefined {
    if (prevState === undefined) {
      return {
        tokenFace: Token.AUTOFAIL,
        count: 0
      };
    } else {
      return prevState;
    }
  });
  const addOneReducer$ = addOne$.mapTo(function addOneReducer(
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
  const removeOneReducer$ = removeOne$.mapTo(function removeOneReducer(
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

function view(state$: Stream<State>): Stream<VNode> {
  return state$.map(state => {
    return tr(".token-count-editor", [
      td(state.tokenFace),
      td(state.count),
      td([div(".controls", [button(".add", ["+"]), button(".remove", ["-"])])])
    ]);
  });
}

function intent(DOM: DOMSource | MockedDOMSource): Intent {
  // https://github.com/cyclejs/cyclejs/issues/869
  if (DOM instanceof MockedDOMSource) {
    return {
      addOne$: DOM.select(".add")
        .events("click")
        .mapTo(null),
      removeOne$: DOM.select(".remove")
        .events("click")
        .mapTo(null)
    };
  } else {
    return {
      addOne$: DOM.select(".add")
        .events("click")
        .mapTo(null),
      removeOne$: DOM.select(".remove")
        .events("click")
        .mapTo(null)
    };
  }
}
