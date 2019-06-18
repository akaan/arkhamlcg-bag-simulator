import { div, VNode } from "@cycle/dom";
import xs, { Stream } from "xstream";

export function view(
  oddsChartVNode: Stream<VNode>,
  bagEditorVNode: Stream<VNode>,
  effectsEditorVNode: Stream<VNode>,
  pullProtocolSelectorReducerVNode: Stream<VNode>,
  bagConfigurationSaverVNode: Stream<VNode>
): Stream<VNode> {
  const bottomLeftPanel$ = xs
    .combine(bagConfigurationSaverVNode, bagEditorVNode)
    .map(div);
  const bottomRightPanel$ = xs
    .combine(pullProtocolSelectorReducerVNode, effectsEditorVNode)
    .map(div);
  const bottomPanel$ = xs.combine(bottomLeftPanel$, bottomRightPanel$).map(div);
  const topPanel$ = oddsChartVNode.map(vnode => div([vnode]));
  return xs.combine(topPanel$, bottomPanel$).map(vnodes => div(".app", vnodes));
}
