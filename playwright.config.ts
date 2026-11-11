import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e", timeout: 20_000, fullyParallel: true, reporter: "list",
  use: { baseURL: "http://localhost:4173", screenshot: "off" },
  webServer: { command: "python3 -m http.server 4173 --directory mdbook/book", url: "http://localhost:4173/labs/cost-calculator.html", reuseExistingServer: true },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
});
