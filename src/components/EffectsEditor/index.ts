import { tbody } from "@cycle/dom";
import { Instances, makeCollection } from "@cycle/state";
import { pickMergeSinks } from "cyclejs-utils";
import { driverNames } from "../../drivers";
import { Sinks, Sources } from "../../interfaces";
import { TokenEffectEditor } from "../TokenEffectEditor";
import { model, State } from "./model";
import { view } from "./view";

export type State = State;

const TokenEffectEditorList = makeCollection({
  item: TokenEffectEditor,
  itemKey: (_childState, index) => `row_${index}`,
  itemScope: key => ({ state: null, "*": "." + key }),
  collectSinks: pickMergeSinks(driverNames, {
    DOM: (ins: Instances<any>) => ins.pickCombine("DOM").map(tbody)
  }) as any
});

export function EffectsEditor(sources: Sources<State>): Sinks<State> {
  const editorsSinks = TokenEffectEditorList(sources);

  return {
    DOM: view(editorsSinks.DOM),
    state: model(editorsSinks.state)
  };
}
