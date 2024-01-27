import { render as litRender } from "@lit-labs/ssr";
import { collectResultSync } from "@lit-labs/ssr/lib/render-result.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { LitSsrError } from "./types.js";
import validate from "./validate.js";

import loadModule from "../module/loadModule.js";

import { html } from "lit";

export default async function render(body: any): Promise<string | LitSsrError> {
  const error = validate(body);

  if (error) return error;

  const pending: Promise<any>[] = [];

  for (let dependency of body.dependencies) {
    const m = loadModule(dependency.code, dependency.ext);
    pending.push(m);
  }

  await Promise.all(pending);

  const template = html`${unsafeHTML(body.html)}`;
  const ssrResult = litRender(template);

  // status, body, headers
  return collectResultSync(ssrResult);
}
