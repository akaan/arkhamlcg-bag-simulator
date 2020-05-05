import { Token } from "arkham-odds";
import { State as TokenCount } from "../TokenCountEditor";

export function tokensToTokenCount(tokens: Token[]): TokenCount[] {
  return tokens.reduce(
    (acc: TokenCount[], token: Token) => {
      return acc.map(tokenCount => {
        if (tokenCount.tokenFace === token) {
          return { ...tokenCount, count: tokenCount.count + 1 };
        } else {
          return tokenCount;
        }
      });
    },
    [
      { tokenFace: Token.ELDER_SIGN, count: 0 },
      { tokenFace: Token.PLUS_ONE, count: 0 },
      { tokenFace: Token.ZERO, count: 0 },
      { tokenFace: Token.MINUS_ONE, count: 0 },
      { tokenFace: Token.MINUS_TWO, count: 0 },
      { tokenFace: Token.MINUS_THREE, count: 0 },
      { tokenFace: Token.MINUS_FOUR, count: 0 },
      { tokenFace: Token.MINUS_FIVE, count: 0 },
      { tokenFace: Token.MINUS_SIX, count: 0 },
      { tokenFace: Token.MINUS_SEVEN, count: 0 },
      { tokenFace: Token.MINUS_EIGHT, count: 0 },
      { tokenFace: Token.SKULL, count: 0 },
      { tokenFace: Token.CULTIST, count: 0 },
      { tokenFace: Token.TABLET, count: 0 },
      { tokenFace: Token.ELDER_THING, count: 0 },
      { tokenFace: Token.AUTOFAIL, count: 0 },
      { tokenFace: Token.BLESS, count: 0 },
      { tokenFace: Token.CURSE, count: 0 }
    ] as TokenCount[]
  );
}
