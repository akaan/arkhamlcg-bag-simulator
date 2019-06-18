import { DOMSource, MockedDOMSource } from "@cycle/dom";
import { Actions } from "./model";

export function intent(DOM: DOMSource | MockedDOMSource): Actions {
  // https://github.com/cyclejs/cyclejs/issues/869
  if (DOM instanceof MockedDOMSource) {
    return {
      newAbilitySelected$: DOM.select("#select-protocol")
        .events("change")
        .map((event: Event) => (event.target as HTMLInputElement).value)
    };
  } else {
    return {
      newAbilitySelected$: DOM.select("#select-protocol")
        .events("change")
        .map(event => (event.target as HTMLInputElement).value)
    };
  }
}
