/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface Window {
    __PROJECTS?: Array<{
      name: string;
      url: string;
    }>;
  }
}

export {};
