import { defineConfig, devices } from "@playwright/test";

// Deploy-shape tests: English at /, Marathi at /mr/. The combined copy is built by
// tools/build/build_combined.mjs, so the switcher, service-worker scope and hreflang
// links are tested in the same shape as Pages.
export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "**/mr.spec.ts",
  timeout: 30_000,
  fullyParallel: false,
  reporter: "list",
  use: { baseURL: "http://localhost:4174", screenshot: "off" },
  webServer: {
    command: "python3 -m http.server 4174 --directory .e2e-combined",
    url: "http://localhost:4174/mr/index.html",
    reuseExistingServer: true,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
});
