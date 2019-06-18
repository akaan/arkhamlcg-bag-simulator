import { Stream } from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";

export interface Actions {
  saveClicks$: Stream<null>;
  configurationName$: Stream<string>;
}

export function model(actions: Actions): Stream<string> {
  return actions.saveClicks$
    .compose(sampleCombine(actions.configurationName$))
    .map(([_, v]) => v)
    .filter(v => v !== "");
}
