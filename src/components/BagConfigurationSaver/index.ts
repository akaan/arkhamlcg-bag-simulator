import { DOMSource, MockedDOMSource, VNode } from "@cycle/dom";
import { Stream } from "xstream";
import { intent } from "./intent";
import { model } from "./model";
import { view } from "./view";

interface Sources {
  DOM: DOMSource | MockedDOMSource;
}

interface Sinks {
  DOM: Stream<VNode>;
  saveConfigurationAs$: Stream<string>;
}

export function BagConfigurationSaver(sources: Sources): Sinks {
  const actions = intent(sources.DOM);

  return {
    DOM: view(actions.saveClicks$),
    saveConfigurationAs$: model(actions)
  };
}
