import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import "sv-router/generated";
import { initializeDataProviders } from "./lib/data/data-providers/provider-factory";

// Initialize data providers before mounting app
// Async to support dynamic import of mock data in development
await initializeDataProviders();

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
