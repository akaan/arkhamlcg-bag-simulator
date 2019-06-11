// tslint:disable:no-unused-expression
import { mockDOMSource, VNode } from "@cycle/dom";
import { StateSource } from "@cycle/state";
import { Token } from "arkham-odds";
import { expect } from "chai";
import "mocha";
import xs from "xstream";
import { State, TokenCountEditor } from "../../src/components/TokenCountEditor";

describe("TokenCountEditor", () => {
  it("shows the token and its count", () => {
    const stateSource = new StateSource<State>(
      xs.of({
        tokenFace: Token.ELDER_SIGN,
        count: 1
      }),
      "state"
    );

    const sinks = TokenCountEditor({
      DOM: mockDOMSource({}),
      state: stateSource
    });

    sinks.DOM.subscribe({
      next: vtree => {
        expect(
          (vtree.children as VNode[]).some(
            node => node.text === Token.ELDER_SIGN
          )
        ).to.be.true;
        expect(
          (vtree.children as VNode[]).some(node => Number(node.text) === 1)
        ).to.be.true;
      }
    });
  });

  it("initializes with provided state", () => {
    const stateSource = new StateSource<State>(xs.empty(), "state");

    const sinks = TokenCountEditor({
      DOM: mockDOMSource({}),
      state: stateSource
    });

    sinks.state.subscribe({
      next: reducer => {
        expect(
          reducer({ tokenFace: Token.ELDER_SIGN, count: 1 })
        ).to.deep.equal({ tokenFace: Token.ELDER_SIGN, count: 1 });
      }
    });
  });

  it("initializes with default state", () => {
    const stateSource = new StateSource<State>(xs.empty(), "state");

    const sinks = TokenCountEditor({
      DOM: mockDOMSource({}),
      state: stateSource
    });

    sinks.state.subscribe({
      next: reducer => {
        expect(reducer(undefined)).to.deep.equal({
          tokenFace: Token.AUTOFAIL,
          count: 0
        });
      }
    });
  });

  it("increments the token count when the add button is clicked", () => {
    const stateSource = new StateSource<State>(xs.empty(), "state");

    const mockedDOM = mockDOMSource({
      ".add": {
        click: xs.of(1)
      },

      ".remove": {
        click: xs.empty()
      }
    });

    const sinks = TokenCountEditor({
      DOM: mockedDOM,
      state: stateSource
    });

    sinks.state
      .drop(1)
      .take(1)
      .subscribe({
        next: reducer => {
          expect(
            reducer({ tokenFace: Token.ELDER_SIGN, count: 1 })
          ).to.deep.equal({
            tokenFace: Token.ELDER_SIGN,
            count: 2
          });
        }
      });
  });

  it("decrements the token count when the remove button is clicked", () => {
    const stateSource = new StateSource<State>(xs.empty(), "state");

    const mockedDOM = mockDOMSource({
      ".add": {
        click: xs.empty()
      },

      ".remove": {
        click: xs.of(1)
      }
    });

    const sinks = TokenCountEditor({
      DOM: mockedDOM,
      state: stateSource
    });

    sinks.state
      .drop(1)
      .take(1)
      .subscribe({
        next: reducer => {
          expect(
            reducer({ tokenFace: Token.ELDER_SIGN, count: 5 })
          ).to.deep.equal({
            tokenFace: Token.ELDER_SIGN,
            count: 4
          });
        }
      });
  });

  it("updates token count", () => {
    const stateSource = new StateSource<State>(
      xs.of(
        { tokenFace: Token.ELDER_SIGN, count: 1 },
        { tokenFace: Token.ELDER_SIGN, count: 2 },
        { tokenFace: Token.ELDER_SIGN, count: 3 }
      ),
      "state"
    );

    const sinks = TokenCountEditor({
      DOM: mockDOMSource({}),
      state: stateSource
    });

    const expected = [1, 2, 3];

    sinks.DOM.subscribe({
      next: vtree => {
        expect((vtree.children![1] as VNode).text).to.equal(expected.shift());
      }
    });
  });
});
