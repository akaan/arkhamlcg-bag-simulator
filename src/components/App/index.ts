import isolate from "@cycle/isolate";
import { Reducer } from "@cycle/state";
import { Stream } from "xstream";
import { Sinks, Sources } from "../../interfaces";
import { BagConfigurationSaver } from "./../BagConfigurationSaver";
import { BagEditor } from "./../BagEditor";
import { EffectsEditor } from "./../EffectsEditor";
import { OddsChart } from "./../OddsChart";
import { PullProtocolSelector } from "./../PullProtocolSelector";
import { model, State } from "./model";
import { oddsChartProps } from "./oddsChartProps";
import { view } from "./view";

export type State = State;

export function App(sources: Sources<State>): Sinks<State> {
  const state$ = sources.state.stream;

  const oddsChart = OddsChart({
    props$: state$.map(oddsChartProps)
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
