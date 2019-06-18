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
import { BagConfigurationSaver } from "./BagConfigurationSaver";
import { BagEditor, State as BagConfiguration } from "./BagEditor";
import { tokensToTokenCount } from "./BagEditor/tokensToTokenCount";
import { EffectsEditor, State as EditedTokenEffects } from "./EffectsEditor";
import { OddsChart, Props as OddsChartProps } from "./OddsChart";
import {
  PullProtocolSelector,
  State as AbilityAndProtocol
} from "./PullProtocolSelector";
import { State as TokenCount } from "./TokenCountEditor";

interface Configuration {
  title: string;
  bagConfiguration: BagConfiguration;
  tokenEffects: EditedTokenEffects;
  pullProtocol: AbilityAndProtocol;
}

export interface State {
  bagConfiguration: BagConfiguration;
  tokenEffects: EditedTokenEffects;
  pullProtocol: AbilityAndProtocol;
  savedConfigurations: Configuration[];
}

export function App(sources: Sources<State>): Sinks<State> {
  const state$ = sources.state.stream;

  const chartConfigurations$: Stream<OddsChartProps> = state$.map(state => {
    return {
      skillMinusDifficultyRange: skillMinusDiffRange,
      bagEffectsAndProtocols: [
        {
          title: "Odds",
          bag: toBag(state.bagConfiguration.tokensInBag),
          effects: DefaultTokenEffects.merge(toEffects(state.tokenEffects)),
          protocol: state.pullProtocol.protocol
        }
      ].concat(
        state.savedConfigurations.map(config => ({
          title: config.title,
          bag: toBag(config.bagConfiguration.tokensInBag),
          effects: DefaultTokenEffects.merge(toEffects(config.tokenEffects)),
          protocol: config.pullProtocol.protocol
        }))
      )
    };
  });

  const oddsChart = OddsChart({
    props$: chartConfigurations$
  });
  const bagEditor = isolate(BagEditor, "bagConfiguration")(sources);
  const effectsEditor = isolate(EffectsEditor, "tokenEffects")(sources);
  const pullProtocolSelector = isolate(PullProtocolSelector, "pullProtocol")(
    sources
  );
  const bagConfigurationSaver = isolate(BagConfigurationSaver)({
    DOM: sources.DOM
  });

  return {
    DOM: view(
      oddsChart.DOM,
      bagEditor.DOM,
      effectsEditor.DOM,
      pullProtocolSelector.DOM,
      bagConfigurationSaver.DOM
    ),
    state: model(
      bagConfigurationSaver.saveConfigurationAs$,
      bagEditor.state as Stream<Reducer<State>>,
      effectsEditor.state as Stream<Reducer<State>>,
      pullProtocolSelector.state as Stream<Reducer<State>>
    ),
    charts: oddsChart.charts
  };
}

function model(
  saveConfigurationAs: Stream<string>,
  ...childReducers: Array<Stream<Reducer<State>>>
): Stream<Reducer<State>> {
  const initReducer$: Stream<Reducer<State>> = xs.of(function initReducer(
    _prevState: State | undefined
  ): State | undefined {
    return initialState;
  });

  const saveConfigurationReducer$: Stream<
    Reducer<State>
  > = saveConfigurationAs.map(
    configName =>
      function saveConfiguration(
        prevState: State | undefined
      ): State | undefined {
        if (prevState !== undefined) {
          return {
            ...prevState,
            savedConfigurations: prevState.savedConfigurations.concat([
              {
                title: configName,
                bagConfiguration: prevState.bagConfiguration,
                tokenEffects: prevState.tokenEffects,
                pullProtocol: prevState.pullProtocol
              }
            ])
          };
        } else {
          return prevState;
        }
      }
  );

  return xs.merge(initReducer$, saveConfigurationReducer$, ...childReducers);
}

function view(
  oddsChartVNode: Stream<VNode>,
  bagEditorVNode: Stream<VNode>,
  effectsEditorVNode: Stream<VNode>,
  pullProtocolSelectorReducerVNode: Stream<VNode>,
  bagConfigurationSaverVNode: Stream<VNode>
): Stream<VNode> {
  const bottomLeftPanel$ = xs
    .combine(bagConfigurationSaverVNode, bagEditorVNode)
    .map(div);
  const bottomRightPanel$ = xs
    .combine(pullProtocolSelectorReducerVNode, effectsEditorVNode)
    .map(div);
  const bottomPanel$ = xs.combine(bottomLeftPanel$, bottomRightPanel$).map(div);
  const topPanel$ = oddsChartVNode.map(vnode => div([vnode]));
  return xs.combine(topPanel$, bottomPanel$).map(vnodes => div(".app", vnodes));
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
    tokensInBag: tokensToTokenCount(Bags.TheDunwichLegacy.Standard)
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
  },
  savedConfigurations: []
};

const skillMinusDiffRange = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
