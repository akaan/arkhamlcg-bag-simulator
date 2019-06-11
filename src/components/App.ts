import { div, VNode } from "@cycle/dom";
import isolate from "@cycle/isolate";
import { Reducer } from "@cycle/state";
import {
  Bag,
  Bags,
  DefaultTokenEffects,
  Modifier,
  Token,
  TokenEffect,
  TokenEffects
} from "arkham-odds";
import xs, { Stream } from "xstream";
import { StandardPullProtocol } from "../constants";
import { Sinks, Sources } from "../interfaces";
import { BagEditor, fromTokens, State as BagConfiguration } from "./BagEditor";
import { EffectsEditor, State as EditedTokenEffects } from "./EffectsEditor";
import { OddsChart, Props as OddsChartProps } from "./OddsChart";
import {
  PullProtocolSelector,
  State as AbilityAndProtocol
} from "./PullProtocolSelector";
import { State as TokenCount } from "./TokenCountEditor";

export interface State {
  bagConfiguration: BagConfiguration;
  tokenEffects: EditedTokenEffects;
  pullProtocol: AbilityAndProtocol;
}

export function App(sources: Sources<State>): Sinks<State> {
  const state$ = sources.state.stream;

  const configurations$: Stream<OddsChartProps> = state$.map(state => {
    return {
      skillMinusDifficultyRange: skillMinusDiffRange,
      bagEffectsAndProtocol: {
        title: "Odds",
        bag: toBag(state.bagConfiguration.tokensInBag),
        effects: DefaultTokenEffects.merge(toEffects(state.tokenEffects)),
        protocol: state.pullProtocol.protocol
      }
    };
  });

  const oddsChart = OddsChart({
    props$: configurations$
  });

  const bagEditor = isolate(BagEditor, "bagConfiguration")(sources);
  const bagEditorReducer = bagEditor.state as Stream<Reducer<State>>;

  const effectsEditor = isolate(EffectsEditor, "tokenEffects")(sources);
  const effectsEditorReducer = effectsEditor.state as Stream<Reducer<State>>;

  const pullProtocolSelector = isolate(PullProtocolSelector, "pullProtocol")(
    sources
  );
  const pullProtocolSelectorReducer = pullProtocolSelector.state as Stream<
    Reducer<State>
  >;

  const initReducer$: Stream<Reducer<State>> = xs.of(function initReducer(
    _prevState: State | undefined
  ): State | undefined {
    return initialState;
  });

  const view$ = xs
    .combine(
      oddsChart.DOM,
      bagEditor.DOM,
      effectsEditor.DOM,
      pullProtocolSelector.DOM
    )
    .map(
      ([
        oddsChartVNode,
        bagEditorVNode,
        effectsEditorVNode,
        pullProtocolSelectorReducerVNode
      ]: [VNode, VNode, VNode, VNode]) => {
        return div(".app", [
          div([oddsChartVNode]),
          div([
            div(bagEditorVNode),
            div([pullProtocolSelectorReducerVNode, effectsEditorVNode])
          ])
        ]);
      }
    );

  return {
    DOM: view$,
    state: xs.merge(
      initReducer$,
      bagEditorReducer,
      effectsEditorReducer,
      pullProtocolSelectorReducer
    ),
    charts: oddsChart.charts
  };
}

function toBag(tokenCounts: TokenCount[]) {
  const tokens = tokenCounts.reduce(
    (acc, tokenCount) => {
      for (let i = 0; i < tokenCount.count; i++) {
        acc.push(tokenCount.tokenFace);
      }
      return acc;
    },
    [] as Token[]
  );
  return new Bag(tokens);
}

function toEffects(tokensWithEffect: EditedTokenEffects) {
  const mappings = tokensWithEffect.map(
    tokenWithEffect =>
      [tokenWithEffect.tokenFace, tokenWithEffect.effect] as [
        Token,
        TokenEffect
      ]
  );
  return new TokenEffects(mappings);
}

const initialState: State = {
  bagConfiguration: {
    selectedBag: "The Dunwich Legacy - Standard",
    tokensInBag: fromTokens(Bags.TheDunwichLegacy.Standard)
  },
  tokenEffects: [
    { tokenFace: Token.ELDER_SIGN, effect: new Modifier(1) },
    { tokenFace: Token.SKULL, effect: new Modifier(-1) },
    { tokenFace: Token.CULTIST, effect: new Modifier(-2) },
    { tokenFace: Token.TABLET, effect: new Modifier(-2) },
    { tokenFace: Token.ELDER_THING, effect: new Modifier(-2) }
  ],
  pullProtocol: {
    abilitySelected: "None",
    protocol: StandardPullProtocol
  }
};

const skillMinusDiffRange = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
