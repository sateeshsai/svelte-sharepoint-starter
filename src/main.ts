import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import "sv-router/generated";
import { initializeDataProviders } from "./lib/data/provider-factory";

// Initialize data providers before mounting app
initializeDataProviders();

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
