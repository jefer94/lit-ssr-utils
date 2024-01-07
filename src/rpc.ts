import { render } from "./ssr";
import type { HttpLitSsrResponse, HttpLitSsrError } from "./ssr";

export default async function renderLitElement(
  body: any
): Promise<HttpLitSsrResponse | HttpLitSsrError> {
  const res = await render(body);
  if (typeof res === "string") {
    return { html: res };
  }
  return res;
}
