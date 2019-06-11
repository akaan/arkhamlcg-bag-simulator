// tslint:disable:no-unused-expression
import { mockDOMSource, VNode } from "@cycle/dom";
import { StateSource } from "@cycle/state";
import { expect } from "chai";
import "mocha";
import { select } from "snabbdom-selector";
import xs from "xstream";
import {
  PullProtocolSelector,
  State
} from "../../src/components/PullProtocolSelector";
import {
  AvailableCardAbilities,
  StandardPullProtocol
} from "../../src/constants";

describe("PullProtocolSelector", () => {
  it("shows a dropdown with all available card abilities", () => {
    const sources = {
      DOM: mockDOMSource({}),
      state: new StateSource<State>(xs.of(undefined), "state")
    };

    const sinks = PullProtocolSelector(sources);

    sinks.DOM.subscribe({
      next: vtree => {
        const selectElements = select("select", vtree);
        expect(
          selectElements.length,
          "only one HTML select element"
        ).to.be.equal(1);
        if (selectElements.length === 1) {
          const selectElement = selectElements[0];
          expect(selectElement.children, "dropdown has no options").to.not.be
            .undefined;
          const selectOptions = (selectElement.children as VNode[]).map(
            opt => opt.data!.attrs!.value
          );
          const expected = AvailableCardAbilities.map(([label, _]) => label);
          expect(
            selectOptions,
            "options do not match available card abilities"
          ).to.deep.equal(expected);
        }
      }
    });
  });

  it("initializes with provided state", () => {
    const sources = {
      DOM: mockDOMSource({}),
      state: new StateSource<State>(xs.of(undefined), "state")
    };

    const sinks = PullProtocolSelector(sources);

    sinks.state.subscribe({
      next: reducer => {
        const newState = reducer({
          abilitySelected: "None",
          protocol: StandardPullProtocol
        });
        expect(newState).to.not.be.undefined;
        expect(newState!.abilitySelected).to.equal("None");
        expect(newState!.protocol).to.deep.equal(StandardPullProtocol);
      }
    });
  });

  it("initializes with a default state", () => {
    const sources = {
      DOM: mockDOMSource({}),
      state: new StateSource<State>(xs.of(undefined), "state")
    };

    const sinks = PullProtocolSelector(sources);

    sinks.state.subscribe({
      next: reducer => {
        const newState = reducer(undefined);
        expect(newState).to.not.be.undefined;
        expect(newState!.abilitySelected).to.equal("None");
        expect(newState!.protocol).to.deep.equal(StandardPullProtocol);
      }
    });
  });

  it("has dropdown selection matching state", () => {
    const wendy = AvailableCardAbilities.find(
      ([abilityLabel, _]) => abilityLabel === "Wendy's ability"
    );
    expect(wendy, "Wendy's ability not available in AvailableCardAbilities").to
      .not.be.undefined;

    if (wendy != null) {
      const sources = {
        DOM: mockDOMSource({}),
        state: new StateSource<State>(
          xs.of({
            abilitySelected: "Wendy's ability",
            protocol: wendy[1]
          }),
          "state"
        )
      };

      const sinks = PullProtocolSelector(sources);

      sinks.DOM.subscribe({
        next: vtree => {
          const selectElements = select("select", vtree);
          expect(
            selectElements.length,
            "only one HTML select element"
          ).to.be.equal(1);
          if (selectElements.length === 1) {
            const selectElement = selectElements[0];
            expect(selectElement.data!.attrs!.value).to.be.equal(
              "Wendy's ability"
            );

            expect(selectElement.children, "dropdown has no options").to.not.be
              .undefined;
            const wendyOption = (selectElement.children as VNode[]).find(
              opt => opt.data!.attrs!.value === "Wendy's ability"
            );
            expect(wendyOption).to.not.be.undefined;
            expect(wendyOption!.data!.attrs!.selected).to.be.true;
          }
        }
      });
    }
  });

  it("changes the state when a new selection is done", done => {
    const wendy = AvailableCardAbilities.find(
      ([abilityLabel, _]) => abilityLabel === "Wendy's ability"
    );
    expect(wendy, "Wendy's ability not available in AvailableCardAbilities").to
      .not.be.undefined;

    if (wendy != null) {
      const sources = {
        DOM: mockDOMSource({
          "#select-protocol": {
            change: xs.of({ target: { value: wendy[0] } })
          }
        }),
        state: new StateSource<State>(xs.of(undefined), "state")
      };

      const sinks = PullProtocolSelector(sources);

      sinks.state.drop(1).subscribe({
        next: reducer => {
          const newState = reducer({
            abilitySelected: "None",
            protocol: StandardPullProtocol
          });

          expect(newState).to.not.be.undefined;
          expect(newState!.abilitySelected).to.be.equal(wendy[0]);
          expect(newState!.protocol).to.deep.equal(wendy[1]);
          done();
        }
      });

      expect.fail("No reducer streamed.");
    }
  });
});
