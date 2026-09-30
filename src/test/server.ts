import { setupServer } from "msw/node";

// Starts with no handlers. Each test adds the responses it needs.
export const server = setupServer();
