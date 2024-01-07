import type { LitSsrError } from "./types";

export default function validate(body: any): LitSsrError | undefined {
  if (!body || Object.keys(body).length === 0) {
    return { message: "body is empty", code: "no-body" };
  }

  if (body.html === undefined || body.html === "") {
    return { message: "html is required", code: "no-html" };
  }

  if (
    body.dependencies === undefined ||
    !(body.dependencies instanceof Array)
  ) {
    return { message: "dependencies is required", code: "no-dependencies" };
  }

  for (let dependency of body.dependencies) {
    if (dependency.code === undefined || dependency.code === "") {
      return { message: "dependencies[x].code is required", code: "no-code" };
    }

    if (dependency.ext === undefined || dependency.ext === "") {
      return { message: "dependencies[x].ext is required", code: "no-ext" };
    }

    if (dependency.ext !== "js" && dependency.ext !== "ts") {
      return {
        message: "dependencies[x].ext must be js or ts",
        code: "invalid-ext",
      };
    }
  }
}
