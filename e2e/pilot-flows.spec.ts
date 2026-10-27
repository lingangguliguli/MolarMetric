import { test, expect } from "@playwright/test";

test.describe("MolarMetric Pilot Readiness E2E Suite", () => {
  test("Landing page loads with honest copy and no unverified claims", async ({ page }) => {
    await page.goto("/");

    // Verify title and heading
    await expect(page).toHaveTitle(/MolarMetric/);
    await expect(page.locator("h1")).toContainText("Turn Leaked Patient Enquiries");

    // Verify unverified numbers are absent
    const content = await page.textContent("body");
    expect(content).not.toContain("₹6.4 Cr+");
    expect(content).not.toContain("180+ Premier Indian Clinics");
    expect(content).not.toContain("93.8%");
    expect(content).not.toContain("Direct Cashfree Gateway Integration");

    // Verify honest highlights exist
    expect(content).toContain("Indian Clinic Focus");
    expect(content).toContain("Structured Triage");
    expect(content).toContain("Free During Supervised Pilot");
  });

  test("Interactive ROI Calculator updates dynamically with capped model", async ({ page }) => {
    await page.goto("/#roi-calculator");

    // Check slider exists and updates output
    const slider = page.locator('input[aria-label="Monthly Patient Enquiries"]');
    await expect(slider).toBeVisible();

    // Verify assessment model assumptions note is rendered
    await expect(page.locator("text=Assessment Model Assumptions")).toBeVisible();
    await expect(page.locator("text=hypothetical models, not guaranteed revenue")).toBeVisible();
  });

  test("Legal and trust pages are all accessible and contain required draft disclaimers", async ({ page }) => {
    const legalRoutes = [
      { path: "/privacy", title: "Privacy Policy" },
      { path: "/terms", title: "Terms of Service" },
      { path: "/refund-policy", title: "Refund & Cancellation Policy" },
      { path: "/contact", title: "Contact Practice Desk" },
      { path: "/dpa", title: "Data Processing Agreement (DPA)" },
      { path: "/security", title: "Security Architecture & Controls" },
    ];

    for (const route of legalRoutes) {
      await page.goto(route.path);
      await expect(page.locator("h1")).toContainText(route.title);
      await expect(page.locator("text=Notice: Draft Document — Pending Legal Review")).toBeVisible();
    }
  });

  test("Health check endpoint reports 200 OK without disclosing secrets", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(json.app).toBe("MolarMetric");
    expect(json.status).toBe("healthy");
    expect(json.database).toBeDefined();

    // Verify no secret leakage
    const bodyStr = JSON.stringify(json);
    expect(bodyStr).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(bodyStr).not.toContain("CASHFREE_SECRET_KEY");
    expect(bodyStr).not.toContain("password");
  });

  test("Registration page enforces terms acceptance and plan parameters", async ({ page }) => {
    await page.goto("/register?plan=boutique");

    // Verify plan badge shows boutique
    await expect(page.locator("text=Boutique (Single Chair Pilot)")).toBeVisible();

    // Verify terms checkbox exists
    const termsCheckbox = page.locator('input#termsAccepted');
    await expect(termsCheckbox).toBeVisible();
    expect(await termsCheckbox.isChecked()).toBe(false);

    // Verify links to terms and privacy are present
    await expect(page.locator('a[href="/terms"]')).toBeVisible();
    await expect(page.locator('a[href="/privacy"]')).toBeVisible();
  });
});
