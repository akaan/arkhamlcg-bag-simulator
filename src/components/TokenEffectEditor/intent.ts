import { DOMSource, MockedDOMSource } from "@cycle/dom";
import { Autofail, Autosuccess, Modifier, TokenEffect } from "arkham-odds";
import { Actions } from "./model";

function toTokenEffect(stringValue: string): TokenEffect {
  if (stringValue === "Autosuccess") {
    return new Autosuccess();
  } else if (stringValue === "Autofail") {
    return new Autofail();
  } else {
    const modifier = parseInt(stringValue, 10);
    if (!isNaN(modifier)) {
      return new Modifier(modifier);
    } else {
      throw new Error(`unable to parse ${stringValue} as an effect`);
    }
  }
}

export function intent(DOM: DOMSource | MockedDOMSource): Actions {
  // https://github.com/cyclejs/cyclejs/issues/869
  if (DOM instanceof MockedDOMSource) {
    return {
      effectSelected$: DOM.select(".select-effect")
        .events("change")
        .map((event: Event) => (event.target as HTMLInputElement).value)
        .map(toTokenEffect)
    };
  } else {
    return {
      effectSelected$: DOM.select(".select-effect")
        .events("change")
        .map(event => (event.target as HTMLInputElement).value)
        .map(toTokenEffect)
    };
  }
}
