import { test, expect } from '@playwright/test';

test.describe('CRUD Clientes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inicio-sesion');
    await page.fill('input[type="email"]', 'admin@lexusfx.com');
    await page.fill('input[type="password"]', 'Admin2025');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/panel**');
  });

  test('lista de clientes carga', async ({ page }) => {
    await page.goto('/panel/clientes');
    await expect(page.locator('text=Gestion de Clientes')).toBeVisible();
  });

  test('boton nuevo cliente visible', async ({ page }) => {
    await page.goto('/panel/clientes');
    await expect(page.locator('text=Nuevo Cliente')).toBeVisible();
  });

  test('navegar a nuevo cliente', async ({ page }) => {
    await page.goto('/panel/clientes');
    await page.click('text=Nuevo Cliente');
    await expect(page).toHaveURL(/.*nuevo-cliente.*/);
  });
});
