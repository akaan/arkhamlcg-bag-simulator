// tslint:disable:no-unused-expression
import { mockDOMSource } from "@cycle/dom";
import { StateSource } from "@cycle/state";
import { Autofail, Autosuccess, Modifier, Token } from "arkham-odds";
import { expect } from "chai";
import "mocha";
import { select as vdomSelect } from "snabbdom-selector";
import xs from "xstream";
import {
  State,
  TokenEffectEditor
} from "../../src/components/TokenEffectEditor";
import { vtreeContainsText } from "../support/utils";

describe("TokenEffectEditor", () => {
  it("shows the token and its effect", () => {
    const stateSource = new StateSource<State>(
      xs.of({
        tokenFace: Token.ELDER_SIGN,
        effect: new Autosuccess()
      }),
      "state"
    );

    const sinks = TokenEffectEditor({
      DOM: mockDOMSource({}),
      state: stateSource
    });

    sinks.DOM.subscribe({
      next: vtree => {
        expect(vtreeContainsText(vtree, Token.ELDER_SIGN), "Token is not shown")
          .to.be.true;
        const effectDropdown = vdomSelect(".select-effect", vtree);
        if (effectDropdown.length !== 0) {
          expect(effectDropdown[0].data!.attrs!.value).to.equal("Autosuccess");
        } else {
          expect.fail("No effect dropdown, or too much.");
        }
      }
    });
  });

  it("initializes with provided state", () => {
    const stateSource = new StateSource<State>(xs.empty(), "state");

    const sinks = TokenEffectEditor({
      DOM: mockDOMSource({}),
      state: stateSource
    });

    sinks.state.subscribe({
      next: reducer => {
        const newState = reducer({
          tokenFace: Token.ELDER_SIGN,
          effect: new Modifier(1)
        });
        expect(newState!.tokenFace).to.equal(Token.ELDER_SIGN);
        expect(newState!.effect.sameAs(new Modifier(1))).to.be.true;
      }
    });
  });

  it("initializes with a default state", () => {
    const stateSource = new StateSource<State>(xs.empty(), "state");

    const sinks = TokenEffectEditor({
      DOM: mockDOMSource({}),
      state: stateSource
    });

    sinks.state.subscribe({
      next: reducer => {
        const newState = reducer(undefined);
        expect(newState!.tokenFace).to.equal(Token.AUTOFAIL);
        expect(newState!.effect.sameAs(new Autofail())).to.be.true;
      }
    });
  });

  it("changes the token effect when a new value is selected", done => {
    const stateSource = new StateSource<State>(xs.empty(), "state");

    const mockedDOM = mockDOMSource({
      ".select-effect": {
        change: xs.of({ target: { value: "+1" } })
      }
    });

    const sinks = TokenEffectEditor({
      DOM: mockedDOM,
      state: stateSource
    });

    sinks.state
      .drop(1)
      .take(1)
      .subscribe({
        next: reducer => {
          const newState = reducer({
            tokenFace: Token.ELDER_SIGN,
            effect: new Autosuccess()
          });
          expect(newState!.effect.sameAs(new Modifier(1))).to.be.true;
          done();
        }
      });

    expect.fail("No reducer streamed.");
  });
});
