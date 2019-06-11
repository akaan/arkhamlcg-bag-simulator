// tslint:disable:no-unused-expression
import { div, p } from "@cycle/dom";
import { expect } from "chai";
import "mocha";
import { vtreeContainsText } from "./utils";

describe("utils", () => {
  describe("vtreeContainsText", () => {
    it("returns false if the node is empty", () => {
      expect(vtreeContainsText(div(), "searched text")).to.be.false;
    });

    describe("with a single node", () => {
      it("returns true if the node contains the text", () => {
        expect(
          vtreeContainsText(
            p("This contains the searched text in a paragraph."),
            "searched text"
          )
        ).to.be.true;
      });

      it("returns false if the node does not contain the text", () => {
        expect(
          vtreeContainsText(
            p("This contains the searched text in a paragraph."),
            "smelly cat"
          )
        ).to.be.false;
      });

      it("works when the text is passed as a child", () => {
        expect(
          vtreeContainsText(
            p(["This contains the searched text in a paragraph."]),
            "searched text"
          )
        ).to.be.true;
      });
    });

    describe("with a tree of nodes", () => {
      it("returns true if a descendant contains the text", () => {
        expect(
          vtreeContainsText(
            div([
              div([
                p("Some text"),
                p("Some other text"),
                div([p("Here, text again"), p("Finally the searched text.")])
              ])
            ]),
            "searched text"
          )
        ).to.be.true;
      });

      it("returns false if no descendant contains the text", () => {
        expect(
          vtreeContainsText(
            div([
              div([
                p("Some text"),
                p("Some other text"),
                div([p("Here, text again"), p("Can't find it !")])
              ])
            ]),
            "searched text"
          )
        ).to.be.false;
      });
    });
  });
});
