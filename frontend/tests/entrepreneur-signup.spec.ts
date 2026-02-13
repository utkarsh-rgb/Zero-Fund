import { test, expect } from '@playwright/test';

test('Entrepreneur Signup - Successful Form Submission', async ({ page }) => {

  // Open signup page
  await page.goto('http://localhost:8080/entrepreneur-signup');

  // If intro screen appears → click Skip intro
  const skipIntro = page.getByText('Skip intro');
  if (await skipIntro.isVisible()) {
    await skipIntro.click();
  }

  // Fill Full Name
  await page.getByPlaceholder('Enter your full name')
    .fill('Utkarsh Gupta');

  // Fill Email
  await page.getByPlaceholder('Enter your email')
    .fill('utkarsh.playwright@test.com');

  // Fill Strong Password (must satisfy your validation rules)
  await page.getByPlaceholder('Create a strong password')
    .fill('Test@1234');

  // Fill Confirm Password
  await page.getByPlaceholder('Confirm your password')
    .fill('Test@1234');

  // Accept Terms Checkbox
  await page.locator('#terms').check();

  // Submit Form
  await page.getByRole('button', { name: 'Create Entrepreneur Account' })
    .click();

  // Verify Success Modal Appears
  await expect(
    page.getByText('Account Created Successfully!')
  ).toBeVisible();

  // Verify Email is displayed in success modal
  await expect(
    page.getByText('utkarsh.playwright@test.com')
  ).toBeVisible();

});
