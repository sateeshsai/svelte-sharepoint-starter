import { navigating } from "$lib/common-library/integrations/router/router-helpers.svelte";
import { global_State } from "$lib/data/global-state.svelte";

import type { Hooks } from "sv-router";
import { navigate } from "sv-router/generated";

/**
 * Admin route guard - redirects non-admin users to home. This is not a security feature. Access control should be set inside powerpoint.
 */
export default {
  beforeLoad() {
    if (global_State.accessRole !== "Admin") {
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
