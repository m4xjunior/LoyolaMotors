import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const root = process.cwd();

test.describe('Convenciones Castellano', () => {
  test('archivos del panel en castellano', () => {
    expect(fs.existsSync(path.join(root, 'src/paginas/PaginaPanel.jsx'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'src/paginas/PaginaClientes.jsx'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'src/disposicion/PanelDisposicion/PanelPrincipal.jsx'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'src/contextos/ContextoAutenticacion.jsx'))).toBe(true);
  });

  test('no hay imports con paths viejos en ingles', () => {
    const result = execSync(
      'grep -rn "contexts/AuthContext\\|layout/DashboardLayout\\|pages/Dashboard" src/paginas/ src/disposicion/ src/App.jsx || echo "CLEAN"',
      { encoding: 'utf-8', cwd: root }
    );
    expect(result.trim()).toBe('CLEAN');
  });
});
