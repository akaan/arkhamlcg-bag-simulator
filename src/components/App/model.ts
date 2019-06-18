import { Reducer } from "@cycle/state";
import { Bags, Modifier, Token } from "arkham-odds";
import xs, { Stream } from "xstream";
import { StandardPullProtocol } from "../../constants";
import { tokensToTokenCount } from "../BagEditor/tokensToTokenCount";
import { State as BagConfiguration } from "./../BagEditor";
import { State as EditedTokenEffects } from "./../EffectsEditor";
import { State as AbilityAndProtocol } from "./../PullProtocolSelector";

interface Configuration {
  title: string;
  bagConfiguration: BagConfiguration;
  tokenEffects: EditedTokenEffects;
  pullProtocol: AbilityAndProtocol;
}

export interface State {
  bagConfiguration: BagConfiguration;
  tokenEffects: EditedTokenEffects;
  pullProtocol: AbilityAndProtocol;
  savedConfigurations: Configuration[];
}

const initialState: State = {
  bagConfiguration: {
    selectedBag: "The Dunwich Legacy - Standard",
    tokensInBag: tokensToTokenCount(Bags.TheDunwichLegacy.Standard)
  },
  tokenEffects: [
    { tokenFace: Token.ELDER_SIGN, effect: new Modifier(1) },
    { tokenFace: Token.SKULL, effect: new Modifier(-1) },
    { tokenFace: Token.CULTIST, effect: new Modifier(-2) },
    { tokenFace: Token.TABLET, effect: new Modifier(-2) },
    { tokenFace: Token.ELDER_THING, effect: new Modifier(-2) }
  ],
  pullProtocol: {
    abilitySelected: "None",
    protocol: StandardPullProtocol
  },
  savedConfigurations: []
};

export function model(
  saveConfigurationAs: Stream<string>,
  ...childReducers: Array<Stream<Reducer<State>>>
): Stream<Reducer<State>> {
  const initReducer$: Stream<Reducer<State>> = xs.of(function initReducer(
    _prevState: State | undefined
  ): State | undefined {
    return initialState;
  });

  const saveConfigurationReducer$: Stream<
    Reducer<State>
  > = saveConfigurationAs.map(
    configName =>
      function saveConfiguration(
        prevState: State | undefined
      ): State | undefined {
        if (prevState !== undefined) {
          return {
            ...prevState,
            savedConfigurations: prevState.savedConfigurations.concat([
              {
                title: configName,
                bagConfiguration: prevState.bagConfiguration,
                tokenEffects: prevState.tokenEffects,
                pullProtocol: prevState.pullProtocol
              }
            ])
          };
        } else {
          return prevState;
        }
      }
  );

  return xs.merge(initReducer$, saveConfigurationReducer$, ...childReducers);
}
