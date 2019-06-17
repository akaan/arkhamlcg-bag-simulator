// tslint:disable:no-unused-expression
import { mockDOMSource } from "@cycle/dom";
import { expect } from "chai";
import "mocha";
import { select } from "snabbdom-selector";
import fromDiagram from "xstream/extra/fromDiagram";
import { BagConfigurationSaver } from "../../src/components/BagConfigurationSaver";

describe("BagConfigurationSaver", () => {
  it("shows a text box and a save button", () => {
    const sinks = BagConfigurationSaver({
      DOM: mockDOMSource({})
    });

    sinks.DOM.subscribe({
      next: vtree => {
        const searchTextInput = select("input[type=text]", vtree);
        expect(searchTextInput.length, "No text box").to.be.equal(1);

        const searchButton = select("button", vtree);
        expect(searchButton.length, "No button").to.be.equal(1);
        expect(searchButton[0].text, "No 'Save' button").to.be.equal("Save");
      }
    });
  });

  it("streams the text box value when the save button is clicked", done => {
    const sinks = BagConfigurationSaver({
      DOM: mockDOMSource({
        ".configurarion-name": {
          change: fromDiagram("a-b-c--d-----|", {
            values: { a: "N", b: "Na", c: "Nam", d: "Name" },
            timeUnit: 5
          }).map(v => ({ target: { value: v } }))
        },
        ".save-configuration": {
          click: fromDiagram("------------a|", {
            values: { a: null },
            timeUnit: 5
          })
        }
      })
    });

    sinks.saveConfigurationAs$.subscribe({
      next: configName => {
        expect(configName).to.equal("Name");
        done();
      }
    });
  });

  it("does not stream empty values", done => {
    const sinks = BagConfigurationSaver({
      DOM: mockDOMSource({
        ".configurarion-name": {
          change: fromDiagram("a--b--c-----|", {
            values: { a: "a value", b: "", c: "another value" },
            timeUnit: 5
          }).map(v => ({ target: { value: v } }))
        },
        ".save-configuration": {
          click: fromDiagram("-a--a-----a-|", {
            values: { a: null },
            timeUnit: 5
          })
        }
      })
    });

    const expected = ["a value", "another value"];

    sinks.saveConfigurationAs$.subscribe({
      next: configName => {
        expect(configName).to.equal(expected.shift());
        if (expected.length === 0) {
          done();
        }
      }
    });
  });
});
