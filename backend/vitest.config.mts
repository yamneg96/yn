import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // First run downloads a mongod binary for the in-memory database.
    hookTimeout: 300_000,
    testTimeout: 30_000,
    fileParallelism: false,
  },
});
