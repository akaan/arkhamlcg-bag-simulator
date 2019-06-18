import { button, div, input, VNode } from "@cycle/dom";
import xs, { Stream } from "xstream";
import { Actions } from "./model";

export function view(actions: Actions): Stream<VNode> {
  const { saveClicks$, configurationName$ } = actions;

  const inputValue$ = xs.merge(configurationName$, saveClicks$.mapTo(""));

  return inputValue$.startWith("").map(v =>
    div(".bag-configuration-saver", [
      input(".configuration-name", {
        attrs: { type: "text", placeholder: "Configuration name" },
        props: { value: v }
      }),
      button(".save-configuration", "Save")
    ])
  );
}
