export {};

declare module 'express' {
  interface Request {
    user?: any;
  }
}
