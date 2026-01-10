/**
 * ShadCN Utilities
 *
 * This file contains utilities required by shadcn-svelte components.
 * For common library utilities, import from "$lib/common-library/utils".
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind CSS classes with clsx for conditional class composition */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
