import { test, expect } from '@playwright/test';

test.describe('Autenticacion', () => {
  test('login con credenciales validas', async ({ page }) => {
    await page.goto('/inicio-sesion');
    await page.fill('input[type="email"]', 'admin@lexusfx.com');
    await page.fill('input[type="password"]', 'Admin2025');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/panel**');
    await expect(page.locator('text=Bienvenido')).toBeVisible();
  });

  test('login con credenciales invalidas muestra error', async ({ page }) => {
    await page.goto('/inicio-sesion');
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'wrong');
    await page.click('button[type="submit"]');
    // The error div uses inline style with color #ff6b4a and background rgba(255,61,36,0.1)
    await expect(page.locator('text=Credenciales incorrectas')).toBeVisible({ timeout: 5000 });
  });

  test('ruta protegida redirige a login', async ({ page }) => {
    await page.goto('/panel');
    await page.waitForURL('**/inicio-sesion**');
  });
});
