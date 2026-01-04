import { navigating } from "$lib/common-library/integrations/router/router-helpers.svelte";
import { global_State } from "$lib/data/global-state.svelte";

import type { Hooks } from "sv-router";
import { navigate } from "sv-router/generated";

export default {
  beforeLoad() {
    if (global_State.AccessRole !== "Admin") {
      navigate("/", {
        replace: true,
      });
    }
    navigating.afterload = false;
    navigating.beforeload = true;
  },
  afterLoad() {
    navigating.beforeload = false;
    navigating.afterload = true;
  },
  onPreload() {},
  onError() {},
} satisfies Hooks;
