import renderLitElement from "../../api";

type Context = {
  body: unknown;
  set: {
    headers: Record<string, string>;
    status?: number;
  };
};

export async function renderLitComponent({ body, set }: Context) {
  const [code, json, headers] = await renderLitElement(body);
  set.status = code;
  set.headers = headers;
  return json;
}
