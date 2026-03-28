import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const root = process.cwd();

test.describe('Arquitectura CRUD-Ready', () => {
  const servicios = [
    'servicioClientes',
    'servicioVehiculos',
    'servicioServicios',
    'servicioFacturas',
    'servicioUsuarios',
    'servicioRepuestos',
    'servicioCitas',
    'servicioReportes',
    'servicioContenido',
    'servicioConfiguracion',
  ];

  for (const servicio of servicios) {
    test(`servicio ${servicio} existe`, () => {
      expect(fs.existsSync(path.join(root, `src/servicios/${servicio}.js`))).toBe(true);
    });
  }

  test('feature toggles configurados', () => {
    expect(fs.existsSync(path.join(root, 'src/configuracion/caracteristicas.js'))).toBe(true);
  });
});
