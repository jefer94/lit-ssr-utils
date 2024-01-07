import * as fs from "fs";
import { exec } from "child_process";

function dirs(directory: string): string[][] {
  const list = fs.readdirSync(directory, { withFileTypes: true });

  const dirs = [];
  const files = [];

  for (const x of list) {
    if (x.isDirectory()) {
      dirs.push(x.name);
    } else {
      files.push(x.name);
    }
  }

  return [dirs, files];
}

// Example usage:
const directoryPath = ".";
const [folders, files] = dirs(directoryPath);
console.log(folders);

let args = "";

for (const x of folders) {
  if (x === "node_modules") continue;
  if (x === "scripts") continue;
  if (x === "test") continue;
  if (x === ".vscode") continue;
  if (x === ".git") continue;
  if (x === "tmp") continue;
  if (x === "bin") continue;
  if (x === "dist") continue;

  args += `${x}/*.ts `;
  // args += `${x}/**/*.ts `;
}

// for (const x of files) {
//   if (x.indexOf(".ts") === -1) continue;
//   args += `${x} `;
// }

let command = `bun build ${args} --outdir . --targer=node -e '*'`;

exec(command, (err, stdout, stderr) => {
  console.log(err);
  console.log(stdout);
  console.log(stderr);
});
