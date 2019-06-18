import { DOMSource, MockedDOMSource } from "@cycle/dom";
import { Intent } from "./model";

export function intent(DOM: DOMSource | MockedDOMSource): Intent {
  // https://github.com/cyclejs/cyclejs/issues/869
  if (DOM instanceof MockedDOMSource) {
    return {
      addOne$: DOM.select(".add")
        .events("click")
        .mapTo(null),
      removeOne$: DOM.select(".remove")
        .events("click")
        .mapTo(null)
    };
  } else {
    return {
      addOne$: DOM.select(".add")
        .events("click")
        .mapTo(null),
      removeOne$: DOM.select(".remove")
        .events("click")
        .mapTo(null)
    };
  }
}
