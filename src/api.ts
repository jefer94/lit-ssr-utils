import { render } from "./ssr";
import type { HttpLitSsr } from "./ssr";

export default async function decoupledHandler(body: any): Promise<HttpLitSsr> {
  const res = await render(body);
  if (typeof res === "string") {
    return [200, { html: res }, {}];
  }
  return [400, res, {}];
}
