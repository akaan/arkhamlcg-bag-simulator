import { run } from "@cycle/run";
import { App } from "./components/App";
import { getDrivers, wrapMain } from "./drivers";
import { Component } from "./interfaces";
import "./main.scss";

const main: Component<any> = wrapMain(App);

run(main as any, getDrivers());
