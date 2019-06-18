import {
  Bag,
  DefaultTokenEffects,
  Token,
  TokenEffect,
  TokenEffects
} from "arkham-odds";
import { State as EditedTokenEffects } from "./../EffectsEditor";
import { Props as OddsChartProps } from "./../OddsChart";
import { State as TokenCount } from "./../TokenCountEditor";
import { State } from "./model";

function toBag(tokenCounts: TokenCount[]) {
  const tokens = tokenCounts.reduce(
    (acc, tokenCount) => {
      for (let i = 0; i < tokenCount.count; i++) {
        acc.push(tokenCount.tokenFace);
      }
      return acc;
    },
    [] as Token[]
  );
  return new Bag(tokens);
}

function toEffects(tokensWithEffect: EditedTokenEffects) {
  const mappings = tokensWithEffect.map(
    tokenWithEffect =>
      [tokenWithEffect.tokenFace, tokenWithEffect.effect] as [
        Token,
        TokenEffect
      ]
  );
  return new TokenEffects(mappings);
}

const skillMinusDiffRange = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

export function oddsChartProps(state: State): OddsChartProps {
  return {
    skillMinusDifficultyRange: skillMinusDiffRange,
    bagEffectsAndProtocols: [
      {
        title: "Odds",
        bag: toBag(state.bagConfiguration.tokensInBag),
        effects: DefaultTokenEffects.merge(toEffects(state.tokenEffects)),
        protocol: state.pullProtocol.protocol
      }
    ].concat(
      state.savedConfigurations.map(config => ({
        title: config.title,
        bag: toBag(config.bagConfiguration.tokensInBag),
        effects: DefaultTokenEffects.merge(toEffects(config.tokenEffects)),
        protocol: config.pullProtocol.protocol
      }))
    )
  };
}
