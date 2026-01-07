import { MediaQuery } from "svelte/reactivity";

const DEFAULT_MOBILE_BREAKPOINT = 768;

/**
 * Reactive mobile detection using MediaQuery
 * Default breakpoint: 768px (adjust via constructor)
 * @example const isMobile = new IsMobile(); // or new IsMobile(1024)
 */
export class IsMobile extends MediaQuery {
  constructor(breakpoint: number = DEFAULT_MOBILE_BREAKPOINT) {
    super(`max-width: ${breakpoint - 1}px`);
  }
}
