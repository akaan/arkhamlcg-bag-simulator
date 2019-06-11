import {
  div,
  DOMSource,
  MockedDOMSource,
  option,
  select,
  table,
  tbody,
  th,
  thead,
  tr,
  VNode
} from "@cycle/dom";
import isolate from "@cycle/isolate";
import { Instances, makeCollection, Reducer } from "@cycle/state";
import { Token } from "arkham-odds";
import { pickMergeSinks } from "cyclejs-utils";
import xs, { Stream } from "xstream";
import { AvailableBags } from "../constants";
import { driverNames } from "../drivers";
import { Sinks, Sources } from "../interfaces";
import { State as TokenCount, TokenCountEditor } from "./TokenCountEditor";

export interface State {
  selectedBag: string | null;
  tokensInBag: TokenCount[];
}

interface Intent {
  selectedBag$: Stream<string | null>;
}

const TokenCountEditorList = makeCollection({
  item: TokenCountEditor,
  itemKey: (_childState, index) => `row_${index}`,
  itemScope: key => ({ state: null, "*": "." + key }),
  collectSinks: pickMergeSinks(driverNames, {
    DOM: (ins: Instances<any>) => ins.pickCombine("DOM").map(tbody)
  }) as any
});

export function BagEditor(sources: Sources<State>): Sinks<State> {
  const { selectedBag$ } = intent(sources.DOM);

  const editorSinks = isolate(TokenCountEditorList, {
    state: "tokensInBag",
    "*": ".token-count-editor"
  })(sources);

  return {
    DOM: view(sources.state.stream, editorSinks.DOM),
    state: model(selectedBag$, editorSinks.state)
  };
}

function intent(DOM: DOMSource | MockedDOMSource): Intent {
  // https://github.com/cyclejs/cyclejs/issues/869
  if (DOM instanceof MockedDOMSource) {
    return {
      selectedBag$: DOM.select(".select-bag")
        .events("change")
        .map((event: Event) => (event.target as HTMLInputElement).value)
        .map((s: string) => (s === "none" ? null : s))
    };
  } else {
    return {
      selectedBag$: DOM.select(".select-bag")
        .events("change")
        .map(event => (event.target as HTMLInputElement).value)
        .map((s: string) => (s === "none" ? null : s))
    };
  }
}

function model(
  selectedBag$: Stream<string | null>,
  ...mergeWith: Array<Stream<Reducer<State>>>
): Stream<Reducer<State>> {
  const defaultReducer$: Stream<Reducer<State>> = xs.of(function defaultReducer(
    prevState: State | undefined
  ): State | undefined {
    if (prevState != null) {
      return prevState;
    } else {
      return {
        selectedBag: null,
        tokensInBag: []
      };
    }
  });

  const changeBagComposition$: Stream<Reducer<State>> = selectedBag$.map(
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
            ([label, _tokens]) => label === newBagValue
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

  return xs.merge(defaultReducer$, changeBagComposition$, ...mergeWith);
}

function view(state$: Stream<State>, editors: Stream<VNode>): Stream<VNode> {
  return xs.combine(state$, editors).map(([state, vnode]) => {
    return div(".bag-editor", [
      select(
        ".select-bag",
        {
          attrs: {
            value: state.selectedBag === null ? "none" : state.selectedBag
          }
        },
        optionsForBags(state.selectedBag)
      ),
      table([
        thead([tr([th("Token"), th("Count"), th("Add or remove")])]),
        vnode
      ])
    ]);
  });
}

function optionsForBags(selectedBag: string | null): VNode[] {
  return [
    option(
      {
        attrs: {
          value: "none",
          selected: selectedBag === null
        }
      },
      "none"
    )
  ].concat(
    AvailableBags.map(([label, _tokens]) =>
      option(
        {
          attrs: {
            value: label,
            selected: label === selectedBag
          }
        },
        label
      )
    )
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
