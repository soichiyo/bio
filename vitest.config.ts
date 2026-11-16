import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    alias: { "@": new URL(".", import.meta.url).pathname },
  },
});
