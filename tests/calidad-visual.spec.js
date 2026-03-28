import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';

test.describe('Calidad Visual - Analisis Estatico', () => {
  test('cero emojis en archivos del panel', () => {
    // grep for common emojis in paginas/ and disposicion/
    const result = execSync(
      'grep -rn "[📊👤🚗🔧⚙️📋👋⏳✅]" src/paginas/ src/disposicion/ || echo "CLEAN"',
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    expect(result.trim()).toBe('CLEAN');
  });

  test('cero inline SVGs en paginas del panel', () => {
    const result = execSync(
      'grep -rn "<svg" src/paginas/ src/disposicion/ || echo "CLEAN"',
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    // Allow SVG in PaginaPanel (satisfaction ring) and PaginaInicioSesion (Orb)
    const lines = result.split('\n').filter(l =>
      l !== 'CLEAN' &&
      l.trim() !== '' &&
      !l.includes('PaginaPanel') &&
      !l.includes('PaginaInicioSesion')
    );
    expect(lines.length).toBe(0);
  });

  test('cero styled-components en imports', () => {
    const result = execSync(
      'grep -rn "styled-components\\|styled\\." src/paginas/ src/disposicion/ || echo "CLEAN"',
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    expect(result.trim()).toBe('CLEAN');
  });

  test('phosphor-icons importado en sidebar y header', () => {
    const sidebar = execSync(
      'grep -c "@phosphor-icons/react" src/disposicion/PanelDisposicion/PanelBarraLateral.jsx',
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    expect(parseInt(sidebar.trim())).toBeGreaterThan(0);

    const header = execSync(
      'grep -c "@phosphor-icons/react" src/disposicion/PanelDisposicion/PanelCabecera.jsx',
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    expect(parseInt(header.trim())).toBeGreaterThan(0);
  });
});
