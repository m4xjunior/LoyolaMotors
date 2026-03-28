import { test, expect } from '@playwright/test';

test.describe('Navegacion del Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inicio-sesion');
    await page.fill('input[type="email"]', 'admin@lexusfx.com');
    await page.fill('input[type="password"]', 'Admin2025');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/panel**');
  });

  test('dashboard carga correctamente', async ({ page }) => {
    await expect(page.locator('text=Bienvenido')).toBeVisible();
  });

  test('sidebar items visibles para admin', async ({ page }) => {
    await expect(page.locator('text=Clientes')).toBeVisible();
    await expect(page.locator('text=Vehiculos')).toBeVisible();
    await expect(page.locator('text=Servicios')).toBeVisible();
    await expect(page.locator('text=Facturas')).toBeVisible();
  });

  test('navegar a clientes', async ({ page }) => {
    await page.click('text=Clientes');
    await expect(page.locator('text=Gestion de Clientes')).toBeVisible();
  });

  test('navegar a vehiculos', async ({ page }) => {
    await page.click('text=Vehiculos');
    await expect(page.locator('text=Gestion de Vehiculos')).toBeVisible();
  });
});
