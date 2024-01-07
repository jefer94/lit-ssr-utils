import { render } from "./ssr";

async function main(): Promise<void> {
  let body = {};
  if (process.env.BODY) {
    let args = process.env.ARGS ? +process.env.ARGS : 0;
    const dependencies = [];

    if (isNaN(args)) {
      args = 0;
    }

    for (let i = 0; i < args; i++) {
      const arg = process.env[`ARG${i + 1}`] || "";
      const [ext, code] = arg.split(":");
      dependencies.push({ code, ext });
    }

    body = {
      html: process.env.BODY,
      dependencies,
    };
  } else {
    const [exec, filePath, html, ...deps] = process.argv;
    body = {
      html,
      dependencies: deps.map((d) => {
        const [ext, code] = d.split(":");
        return { code, ext };
      }),
    };
  }

  const res = await render(body);
  if (typeof res === "string") {
    console.log(res);
  } else {
    console.error(JSON.stringify(res));
  }
}

main();
