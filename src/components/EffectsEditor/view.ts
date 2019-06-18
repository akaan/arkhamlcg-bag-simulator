import { div, table, th, thead, tr, VNode } from "@cycle/dom";
import { Stream } from "xstream";

export function view(editorsViews$: Stream<VNode[]>): Stream<VNode> {
  return editorsViews$.map(vtree => {
    return div(".effects-editor", [
      table([thead([tr([th("Token"), th("Effect")])]), vtree])
    ]);
  });
}
