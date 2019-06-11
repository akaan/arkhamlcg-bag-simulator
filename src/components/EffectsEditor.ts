import { div, table, tbody, th, thead, tr, VNode } from "@cycle/dom";
import { Instances, makeCollection, Reducer } from "@cycle/state";
import { pickMergeSinks } from "cyclejs-utils";
import { Stream } from "xstream";
import { driverNames } from "../drivers";
import { Sinks, Sources } from "../interfaces";
import {
  State as TokenWithEffect,
  TokenEffectEditor
} from "./TokenEffectEditor";

export type State = TokenWithEffect[];

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

function model(
  editorsReducers$: Stream<Reducer<State>>
): Stream<Reducer<State>> {
  return editorsReducers$;
}

function view(editorsViews$: Stream<VNode[]>): Stream<VNode> {
  return editorsViews$.map(vtree => {
    return div(".effects-editor", [
      table([thead([tr([th("Token"), th("Effect")])]), vtree])
    ]);
  });
}
