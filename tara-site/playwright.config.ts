import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: "http://127.0.0.1:3100" },
  webServer: {
    command: "node tests/helpers/serve-export.mjs",
    url: "http://127.0.0.1:3100/quiz",
    reuseExistingServer: !process.env.CI,
  },
});
