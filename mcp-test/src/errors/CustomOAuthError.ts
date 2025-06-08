// src/errors/CustomOAuthError.ts
export class CustomOAuthError extends Error {
  code: number;
  email: string;
  provider: string;

  constructor(message: string, code: number, email: string, provider: string) {
    super(message);
    this.name = "CustomOAuthError";
    this.code = code;
    this.email = email;
    this.provider = provider;
  }
}
