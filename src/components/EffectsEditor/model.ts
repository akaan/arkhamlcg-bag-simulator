import { Reducer } from "@cycle/state";
import { Stream } from "xstream";
import { State as TokenWithEffect } from "../TokenEffectEditor";

export type State = TokenWithEffect[];

export function model(
  editorsReducers$: Stream<Reducer<State>>
): Stream<Reducer<State>> {
  return editorsReducers$;
}
