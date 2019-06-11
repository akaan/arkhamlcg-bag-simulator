import { mockDOMSource } from "@cycle/dom";
import { StateSource } from "@cycle/state";
import { Token } from "arkham-odds";
import { expect } from "chai";
import "mocha";
import { select } from "snabbdom-selector";
import xs from "xstream";
import { BagEditor, State } from "../../src/components/BagEditor";

describe("BagEditor", () => {
  it("shows token count editors for all tokens", () => {
    const sources = {
      DOM: mockDOMSource({}),
      state: new StateSource<State>(
        xs.of({
          selectedBag: null,
          tokensInBag: [
            { tokenFace: Token.ELDER_SIGN, count: 1 },
            { tokenFace: Token.CULTIST, count: 3 },
            { tokenFace: Token.AUTOFAIL, count: 1 }
          ]
        } as State),
        "state"
      )
    };

    const sinks = BagEditor(sources);

    sinks.DOM.drop(1).subscribe({
      next: vtree => {
        const tokensFaces = select("tbody td:nth-child(1)", vtree);
        expect(tokensFaces.map(tdNode => tdNode.text)).to.deep.equal([
          Token.ELDER_SIGN,
          Token.CULTIST,
          Token.AUTOFAIL
        ]);

        const tokensCounts = select("tbody td:nth-child(2)", vtree);
        expect(tokensCounts.map(tdNode => tdNode.text)).to.deep.equal([
          1,
          3,
          1
        ]);
      }
    });
  });

  it("initializes with provided state", () => {
    const sources = {
      DOM: mockDOMSource({}),
      state: new StateSource<State>(xs.empty(), "state")
    };

    const sinks = BagEditor(sources);

    sinks.state.subscribe({
      next: reducer => {
        const newState = reducer({
          selectedBag: "The Dunwich Legacy (Standard)",
          tokensInBag: [
            { tokenFace: Token.ELDER_SIGN, count: 1 },
            { tokenFace: Token.CULTIST, count: 3 },
            { tokenFace: Token.AUTOFAIL, count: 1 }
          ]
        });

        expect(newState!.selectedBag).to.equal("The Dunwich Legacy (Standard)");
        expect(newState!.tokensInBag).to.deep.equal([
          { tokenFace: Token.ELDER_SIGN, count: 1 },
          { tokenFace: Token.CULTIST, count: 3 },
          { tokenFace: Token.AUTOFAIL, count: 1 }
        ]);
      }
    });
  });

  it("initializes with default state", () => {
    const sources = {
      DOM: mockDOMSource({}),
      state: new StateSource<State>(xs.empty(), "state")
    };

    const sinks = BagEditor(sources);

    sinks.state.subscribe({
      next: reducer => {
        const newState = reducer(undefined);

        expect(newState!.selectedBag).to.equal(null);
        expect(newState!.tokensInBag).to.deep.equal([]);
      }
    });
  });

  it("changes the bag composition when a new bag is selected", done => {
    const sources = {
      DOM: mockDOMSource({
        "#select-bag": {
          change: xs.of({ target: { value: "The Circle Undone (Standard)" } })
        }
      }),
      state: new StateSource<State>(xs.empty(), "state")
    };

    const sinks = BagEditor(sources);

    sinks.state
      .drop(1)
      .take(1)
      .subscribe({
        next: reducer => {
          const newState = reducer({
            selectedBag: null,
            tokensInBag: []
          });

          expect(newState!.selectedBag).to.equal(
            "The Circle Undone (Standard)"
          );
          expect(newState!.tokensInBag.length).to.be.greaterThan(0);
          done();
        }
      });

    expect.fail("No reducer streamed.");
  });
});
