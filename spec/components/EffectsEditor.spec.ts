// tslint:disable:no-unused-expression
import { mockDOMSource } from "@cycle/dom";
import { StateSource } from "@cycle/state";
import { Autofail, Autosuccess, Modifier, Token } from "arkham-odds";
import { expect } from "chai";
import "mocha";
import { select as vdomSelect } from "snabbdom-selector";
import xs from "xstream";
import { EffectsEditor, State } from "../../src/components/EffectsEditor";
import { vtreeContainsText } from "../support/utils";

describe("TokenEffectEditor", () => {
  it("shows the tokens and their effects", () => {
    const stateSource = new StateSource<State>(
      xs.of([
        {
          tokenFace: Token.ELDER_SIGN,
          effect: new Autosuccess()
        },
        {
          tokenFace: Token.CULTIST,
          effect: new Modifier(-3)
        },
        {
          tokenFace: Token.AUTOFAIL,
          effect: new Autofail()
        }
      ]),
      "state"
    );

    const sinks = EffectsEditor({
      DOM: mockDOMSource({}),
      state: stateSource
    });

    sinks.DOM.drop(1).subscribe({
      next: vtree => {
        [Token.ELDER_SIGN, Token.CULTIST, Token.AUTOFAIL].forEach(token => {
          expect(vtreeContainsText(vtree, token), `Token ${token} is not shown`)
            .to.be.true;
        });
        const effectDropdowns = vdomSelect(".select-effect", vtree);
        if (effectDropdowns.length === 3) {
          expect(
            effectDropdowns.map(selectVNode => selectVNode.data!.attrs!.value)
          ).to.have.members(["Autosuccess", "-3", "Autofail"]);
        } else {
          expect.fail("No effect dropdown, or too much.");
        }
      }
    });
  });
});
