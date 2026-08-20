export default async function run(page, ui) {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("http://localhost:3000/");
  await page.waitForTimeout(1000);

  const snapshotBefore = await ui.snapshot();
  console.log("Before click snapshot:", snapshotBefore);

  // Find the mobile menu button
  const button = page.locator('header button[aria-label="Open main menu"]');
  const isVisible = await button.isVisible();
  console.log("Button visible:", isVisible);

  await button.click();
  await page.waitForTimeout(500);

  const snapshotAfter = await ui.snapshot();
  console.log("After click snapshot:", snapshotAfter);

  const menuVisible = await page.locator('text="Check Eligibility & Scoring"').first().isVisible().catch(() => false);
  const faqVisible = await page.locator('header text="FAQ"').first().isVisible().catch(() => false);

  return { isVisible, menuVisible, faqVisible, snapshotAfter };
}
