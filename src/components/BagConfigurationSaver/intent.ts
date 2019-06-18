import { DOMSource, MockedDOMSource } from "@cycle/dom";
import { Stream } from "xstream";
import { Actions } from "./model";

export function intent(DOM: DOMSource | MockedDOMSource): Actions {
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
