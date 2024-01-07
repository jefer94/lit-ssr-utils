export type LitSsrError = {
  message: string;
  code: string;
};

export type HttpLitSsrResponse = { html: string };
export type HttpLitSsrError = LitSsrError;

export type HttpLitSsrHeaders = Record<string, string>;
export type HttpLitSsr = [
  number,
  HttpLitSsrResponse | HttpLitSsrError,
  HttpLitSsrHeaders,
];
