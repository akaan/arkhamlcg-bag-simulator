import { button, div, input, VNode } from "@cycle/dom";
import { Stream } from "xstream";

export function view(saveClicks$: Stream<null>): Stream<VNode> {
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
