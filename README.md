# Lit SSR API

Lit utils to implement SSR to projects that do not use Javascript.

## Installation

To get started with this project, follow these steps:

1. Clone the repository.
2. Install dependencies by running: `bun install -D`.
3. Start the project by running: `npm start`.

## Usage

You can do an HTTP call, but this does not have authentication yet, you must adapt this code to your case, if you use Google Cloud Functions or something like that you would need to implement an authentication.

```HTTP
POST / HTTP/1.1
Content-Type: application/json

{
  "html": "<my-component />"
  "dependencies": [{ "code": "...", "ext": "ts" }]
}
```

Don't forget to import [`@lit-labs/ssr-client/lit-element-hydrate-support.js`](https://lit.dev/docs/ssr/client-usage/#loading-@lit-labsssr-clientlit-element-hydrate-support.js) in your HTML to add hydrate support (issue [#4472](https://github.com/lit/lit/issues/4472)).

### Using adapters

You should implement our adapter with:

```ts
import start from "lit-ssr-utils/adapters/elysia";

start();
```

### Out adapters

| Adapter          | Stability | Ready to use | Additional dependency |
| ---------------- | --------- | ------------ | --------------------- |
| Elysia           | ✅        | 🤔💭         | elysia                |
| unix-socket/bun  | ❌        | ❌           |                       |
| unix-socket/Node | ❌        | ❌           |                       |

### Implementing your favorite framework

You should implement it using:

```ts
import { rpc } from "lit-ssr-utils";
```

Or.

```ts
import { api } from "lit-ssr-utils";
```

I suggest that you check our `examples` folder.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/new-feature`).
6. Create a pull request.

## License

This project is licensed under the [LGPLv3](https://www.gnu.org/licenses/lgpl-3.0.en.html).

## Contact

If you have any questions, feel free to open an issue.
