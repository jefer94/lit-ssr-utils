import { test, expect } from "bun:test";
import render from "../../src/ssr/render";

const vlLink = `
import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('vl-link')
export class VioletLink extends LitElement {
  static styles = css\`p { color: blue }\`;

  @property()
  href: string = '#';

  @property()
  class: string = 'font-medium text-blue-600 dark:text-blue-500 hover:underline';

  static properties = {
    href: {type: String},
    class: {type: String},
  };

  render() {
    return html\`
      <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.css" rel="stylesheet" />
      <a href="\${this.href}" class="\${this.class}"><slot></slot></a>
    \`;
  }
}
`;

const vlButton = `
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export class VioletButton extends LitElement {
  static get properties() {
    return {
      buttonText: { type: String },
      buttonClass: { type: String },
    };
  }

  constructor() {
    super();
    this.buttonText = 'Button';
    this.buttonClass = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';
  }

  static get styles() {
    return css\`
      /* Define your styles here if needed */
      /* Example styles */
      :host {
        display: inline-block;
      }
    \`;
  }

  render() {
    return html\`
      <button class="\${this.buttonClass}">\${this.buttonText}</button>
    \`;
  }
}

customElements.define('vl-button', VioletButton);
`;

for (const input of [undefined, {}]) {
  test(`render(${input})`, async () => {
    const response = await render(input);

    expect(response).toEqual({
      message: "body is empty",
      code: "no-body",
    });
  });
}

for (const input of [undefined, ""]) {
  const renderMessage = input === undefined ? "undefined" : `'${input}'`;
  test(`render({html: ${renderMessage}})`, async () => {
    const response = await render({ html: input });

    expect(response).toEqual({
      message: "html is required",
      code: "no-html",
    });
  });
}

for (const input of [undefined, ""]) {
  const renderMessage = input === undefined ? "undefined" : `'${input}'`;
  test(`render({html: '<a></a>', dependencies ${renderMessage}})`, async () => {
    const response = await render({
      html: "<a></a>",
      dependencies: input,
    });

    expect(response).toEqual({
      message: "dependencies is required",
      code: "no-dependencies",
    });
  });
}

test(`render({html: '<a></a>', dependencies []})`, async () => {
  const response = await render({
    html: "<a></a>",
    dependencies: [],
  });

  expect(response).toEqual(
    "<!--lit-part BRUAAAUVAAA=--><!--lit-part dqJVfBk9hws=--><a></a><!--/lit-part--><?><!--/lit-part-->"
  );
});

for (const input of [undefined, ""]) {
  const renderMessage = input === undefined ? "undefined" : `'${input}'`;
  test(`render({html: '<a></a>', dependencies [{code: ${renderMessage}}]})`, async () => {
    const response = await render({
      html: "<a></a>",
      dependencies: [{ code: input }],
    });

    expect(response).toEqual({
      message: "dependencies[x].code is required",
      code: "no-code",
    });
  });
}

for (const input of [undefined, ""]) {
  const renderMessage = input === undefined ? "undefined" : `'${input}'`;
  test(`render({html: '<a></a>', dependencies [{ code: "1 + 1", ext: ${renderMessage}}]})`, async () => {
    const response = await render({
      html: "<a></a>",
      dependencies: [{ code: "1 + 1", ext: input }],
    });

    expect(response).toEqual({
      message: "dependencies[x].ext is required",
      code: "no-ext",
    });
  });
}

for (const input of ["css", "html", "py"]) {
  const renderMessage = input === undefined ? "undefined" : `'${input}'`;
  test(`render({html: '<a></a>', dependencies [{ code: "1 + 1", ext: ${renderMessage}}]})`, async () => {
    const response = await render({
      html: "<a></a>",
      dependencies: [{ code: "1 + 1", ext: input }],
    });

    expect(response).toEqual({
      message: "dependencies[x].ext must be js or ts",
      code: "invalid-ext",
    });
  });
}

test(`render({html: '...code...', dependencies [...twoDependencies...]})`, async () => {
  const response = await render({
    html: '<vl-link href="/">Click me</vl-link><vl-button buttonText="Press me" />',
    dependencies: [
      { code: vlLink, ext: "ts" },
      { code: vlButton, ext: "js" },
    ],
  });

  expect(response).toEqual(
    '<!--lit-part BRUAAAUVAAA=--><!--lit-part hdTSUJJ/Pcw=--><vl-link  href="/">' +
      '<template shadowroot="open" shadowrootmode="open"><style>p { color: blue }</style>' +
      "<!--lit-part 5TLwDNN+0jg=-->\n      " +
      '<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.css" ' +
      'rel="stylesheet" />\n      <!--lit-node 1--><a href="/" ' +
      'class="font-medium text-blue-600 dark:text-blue-500 hover:underline"><slot></slot></a>\n    ' +
      "<!--/lit-part--></template>Click me</vl-link>" +
      '<vl-button  / buttontext="Press me"><template shadowroot="open" shadowrootmode="open">' +
      "<style>\n      /* Define your styles here if needed */\n      /* Example styles */\n      :host {\n" +
      "        display: inline-block;\n      }\n    </style><!--lit-part 7fn6eVEpOXA=-->\n      " +
      '<!--lit-node 0--><button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">' +
      "<!--lit-part-->Press me<!--/lit-part--></button>\n    <!--/lit-part--></template><!--/lit-part--><?><!--/lit-part-->"
  );
});
