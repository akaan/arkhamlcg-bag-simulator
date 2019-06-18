import { tbody } from "@cycle/dom";
import isolate from "@cycle/isolate";
import { Instances, makeCollection } from "@cycle/state";
import { pickMergeSinks } from "cyclejs-utils";
import { driverNames } from "../../drivers";
import { Sinks, Sources } from "../../interfaces";
import { TokenCountEditor } from "../TokenCountEditor";
import { intent } from "./intent";
import { model, State } from "./model";
import { view } from "./view";

export type State = State;

const TokenCountEditorList = makeCollection({
  item: TokenCountEditor,
  itemKey: (_childState, index) => `row_${index}`,
  itemScope: key => ({ state: null, "*": "." + key }),
  collectSinks: pickMergeSinks(driverNames, {
    DOM: (ins: Instances<any>) => ins.pickCombine("DOM").map(tbody)
  }) as any
});

export function BagEditor(sources: Sources<State>): Sinks<State> {
  const actions = intent(sources.DOM);

  const editorSinks = isolate(TokenCountEditorList, {
    state: "tokensInBag",
    "*": ".token-count-editor"
  })(sources);

  return {
    DOM: view(sources.state.stream, editorSinks.DOM),
    state: model(actions, editorSinks.state)
  };
}
