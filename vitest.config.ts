import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
});
