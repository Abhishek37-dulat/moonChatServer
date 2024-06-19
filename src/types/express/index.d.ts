import "express";

declare global {
  namespace Express {
    interface File {
      location?: string;
    }
  }
}
