import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",   // pas de DOM côté back-end
    globals: true,         // describe/it/expect/vi en global, comme le front
    include: ["src/**/*.test.js"],
    clearMocks: true,
  },
});
