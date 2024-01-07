import { Context } from "elysia";

import renderLitElement from "lit-ssr-utils/api";

export async function renderLitComponent({ body, set }: Context) {
  const [code, json, headers] = await renderLitElement(body);
  set.status = code;
  set.headers = headers;
  return json;
}
