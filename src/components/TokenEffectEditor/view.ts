import { option, select, td, tr, VNode } from "@cycle/dom";
import { Autofail, Autosuccess, Modifier, TokenEffect } from "arkham-odds";
import { Stream } from "xstream";
import { State } from "./model";

const tokenEffectOptions = [
  "Autosuccess",
  "+2",
  "+1",
  "0",
  "-1",
  "-2",
  "-3",
  "-4",
  "-5",
  "-6",
  "-7",
  "-8",
  "Autofail"
];

function renderTokenEffectOptions(state: State): VNode[] {
  return tokenEffectOptions.map(stringEffect =>
    option(
      {
        attrs: {
          value: stringEffect,
          selected: stringEffect === toLabel(state.effect)
        }
      },
      stringEffect
    )
  );
}

function renderSelectTokenEffect(state: State): VNode {
  return select(
    ".select-effect",
    { attrs: { value: toLabel(state.effect) } },
    renderTokenEffectOptions(state)
  );
}

function toLabel(tokenEffect: TokenEffect): string {
  if (tokenEffect instanceof Autosuccess) {
    return "Autosuccess";
  } else if (tokenEffect instanceof Autofail) {
    return "Autofail";
  } else if (tokenEffect instanceof Modifier) {
    const modifier = tokenEffect as Modifier;
    if (modifier.getValue() > 0) {
      return `+${modifier.getValue()}`;
    } else {
      return String(modifier.getValue());
    }
  } else {
    throw new Error(`unknown TokenEffect ${tokenEffect}`);
  }
}

export function view(state$: Stream<State>): Stream<VNode> {
  return state$.map(state => {
    return tr(".token-effect-editor", [
      td(state.tokenFace),
      td(".controls", [renderSelectTokenEffect(state)])
    ]);
  });
}
