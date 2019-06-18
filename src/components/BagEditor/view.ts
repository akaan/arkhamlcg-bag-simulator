import {
  div,
  label,
  option,
  select,
  table,
  th,
  thead,
  tr,
  VNode
} from "@cycle/dom";
import xs, { Stream } from "xstream";
import { State } from ".";
import { AvailableBags } from "../../constants";

function renderSelect(state: State): VNode {
  return select(
    "#select-bag",
    {
      attrs: {
        value: state.selectedBag === null ? "none" : state.selectedBag
      }
    },
    renderOptionsForBags(state.selectedBag)
  );
}

function renderOptionsForBags(selectedBag: string | null): VNode[] {
  return [
    option(
      {
        attrs: {
          value: "none",
          selected: selectedBag === null
        }
      },
      "none"
    )
  ].concat(
    AvailableBags.map(([bagLabel, _tokens]) =>
      option(
        {
          attrs: {
            value: bagLabel,
            selected: bagLabel === selectedBag
          }
        },
        bagLabel
      )
    )
  );
}

export function view(
  state$: Stream<State>,
  editors: Stream<VNode>
): Stream<VNode> {
  return xs.combine(state$, editors).map(([state, editorsVNode]) => {
    return div(".bag-editor", [
      div(".bag-selection", [
        label({ attrs: { for: "select-bag" } }, "Load a bag :"),
        renderSelect(state)
      ]),
      table([
        thead([tr([th("Token"), th("Count"), th("Add or remove")])]),
        editorsVNode
      ])
    ]);
  });
}
