import { makeDOMDriver } from "@cycle/dom";
import { withState } from "@cycle/state";
import { highchartsDriver } from "./drivers/highchartsDriver";
import { Component } from "./interfaces";

const driversFactories: any = {
  DOM: () => makeDOMDriver("#app"),
  charts: () => highchartsDriver
};

export function getDrivers(): any {
  return Object.keys(driversFactories)
    .map(k => ({ [k]: driversFactories[k]() }))
    .reduce((a, c) => ({ ...a, ...c }), {});
}

export const driverNames = Object.keys(driversFactories).concat(["state"]);

export function wrapMain(main: Component<any>): Component<any> {
  return withState(main as any) as any;
}
