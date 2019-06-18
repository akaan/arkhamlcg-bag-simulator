import { div, label, option, select, VNode } from "@cycle/dom";
import { Stream } from "xstream";
import { AvailableCardAbilities } from "../../constants";
import { State } from "./model";

function renderCardAbilitiesOptions(state: State): VNode[] {
  return AvailableCardAbilities.map(([abilityLabel, _]) => {
    return option(
      {
        attrs: {
          value: abilityLabel,
          selected: state.abilitySelected === abilityLabel
        }
      },
      abilityLabel
    );
  });
}

function renderSelectCardAbility(state: State): VNode {
  return select(
    "#select-protocol",
    { attrs: { value: state.abilitySelected } },
    renderCardAbilitiesOptions(state)
  );
}

export function view(state$: Stream<State>): Stream<VNode> {
  return state$.map(state => {
    return div(".pull-protocol-selector", [
      label({ attrs: { for: "select-protocol" } }, "Choose a card ability :"),
      renderSelectCardAbility(state)
    ]);
  });
}
