import {
  button,
  div,
  DOMSource,
  input,
  MockedDOMSource,
  VNode
} from "@cycle/dom";
import { Stream } from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";

interface Sources {
  DOM: DOMSource | MockedDOMSource;
}

interface Sinks {
  DOM: Stream<VNode>;
  saveConfigurationAs$: Stream<string>;
}

interface Intent {
  saveClicks$: Stream<null>;
  configurationName$: Stream<string>;
}

export function BagConfigurationSaver(sources: Sources): Sinks {
  const { saveClicks$, configurationName$ } = intent(sources.DOM);

  return {
    DOM: view(saveClicks$),
    saveConfigurationAs$: model(configurationName$, saveClicks$)
  };
}

function intent(DOM: DOMSource | MockedDOMSource): Intent {
  let textValue$: Stream<string>;
  let saveButtonClicks$: Stream<null>;

  // https://github.com/cyclejs/cyclejs/issues/869
  if (DOM instanceof MockedDOMSource) {
    textValue$ = DOM.select(".configuration-name")
      .events("change")
      .map((event: Event) => (event.target as HTMLInputElement).value);
    saveButtonClicks$ = DOM.select(".save-configuration")
      .events("click")
      .mapTo(null);
  } else {
    textValue$ = DOM.select(".configuration-name")
      .events("change")
      .map((event: Event) => (event.target as HTMLInputElement).value);
    saveButtonClicks$ = DOM.select(".save-configuration")
      .events("click")
      .mapTo(null);
  }

  return {
    saveClicks$: saveButtonClicks$,
    configurationName$: textValue$
  };
}

function model(
  configurationName$: Stream<string>,
  saveClicks$: Stream<null>
): Stream<string> {
  return saveClicks$
    .compose(sampleCombine(configurationName$))
    .map(([_, v]) => v)
    .filter(v => v !== "");
}

function view(saveClicks$: Stream<null>): Stream<VNode> {
  return saveClicks$.startWith(null).map(_ =>
    div(".bag-configuration-saver", [
      input(".configuration-name", {
        attrs: { type: "text", placeholder: "Configuration name" },
        // TODO https://github.com/snabbdom/snabbdom/pull/418
        props: { value: "" }
      }),
      button(".save-configuration", "Save")
    ])
  );
}
