import { DOMSource, MockedDOMSource } from "@cycle/dom";
import { Actions } from "./model";

export function intent(DOM: DOMSource | MockedDOMSource): Actions {
  // https://github.com/cyclejs/cyclejs/issues/869
  if (DOM instanceof MockedDOMSource) {
    return {
      selectedBag$: DOM.select("#select-bag")
        .events("change")
        .map((event: Event) => (event.target as HTMLInputElement).value)
        .map((s: string) => (s === "none" ? null : s))
    };
  } else {
    return {
      selectedBag$: DOM.select("#select-bag")
        .events("change")
        .map(event => (event.target as HTMLInputElement).value)
        .map((s: string) => (s === "none" ? null : s))
    };
  }
}
