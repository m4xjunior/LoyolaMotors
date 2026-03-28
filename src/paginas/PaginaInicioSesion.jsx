import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAutenticacion } from '../contextos/ContextoAutenticacion';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Orb from '../components/Orb/Orb';

export default function PaginaInicioSesion() {
  const [correo, setCorreo] = useState('admin@loyolamotors.com');
  const [contrasena, setContrasena] = useState('admin123');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { iniciarSesion } = useAutenticacion();

  const desde = location.state?.from?.pathname || '/panel';

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    try {
      await iniciarSesion(correo, contrasena);
      navigate(desde, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-[#0a0a0a] p-5 relative overflow-hidden">
      {/* Orbe decorativo de fondo */}
      <div className="absolute w-[1100px] h-[1100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] z-0 opacity-45 pointer-events-none">
        <Orb
          hue={200}
          hoverIntensity={1.8}
          rotateOnHover={false}
          forceHoverState={true}
          backgroundColor="#0a0a0a"
        />
      </div>

      {/* Tarjeta principal — glassmorphism */}
      <div className="w-full max-w-[880px] bg-[rgba(18,18,18,0.75)] backdrop-blur-[40px] backdrop-saturate-[1.4] overflow-hidden border border-white/[0.08] rounded-[20px] grid grid-cols-1 md:grid-cols-[1.1fr_1fr] shadow-[0_24px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] relative z-[1]">
        {/* Panel izquierdo — Marca */}
        <div className="relative min-h-[280px] md:min-h-[520px] p-8 flex flex-col items-center justify-center">
          <div className="absolute inset-3.5 rounded-[14px] overflow-hidden bg-gradient-to-br from-[#1a0a08] via-[#2a0e0a] via-[30%] to-[#0d0a09]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(255,61,36,0.18),transparent_70%)]" />
            <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[rgba(255,61,36,0.3)] to-transparent" />
          </div>

          <div className="relative z-10 text-center max-w-[340px]">
            <div className="mb-7">
              <img
                src="/assets/img/icon/loyola-logo-v2.png"
                alt="Loyola Motors Logo"
                className="h-10 mx-auto block drop-shadow-[0_4px_12px_rgba(255,61,36,0.15)]"
              />
            </div>
            <h2 className="text-[26px] font-semibold leading-tight tracking-tight text-foreground mb-3.5" style={{ fontFamily: "'Inter', sans-serif", fontStyle: 'normal' }}>
              Panel de administración
            </h2>
            <p className="text-sm text-white/45 leading-relaxed tracking-tight">
              Gestiona facturas, clientes y servicios de Loyola Motors desde un solo lugar.
            </p>
          </div>
        </div>

        {/* Panel derecho — Formulario */}
        <div className="flex flex-col justify-center p-6 md:px-9 md:py-8">
          <div className="w-full max-w-[360px] mx-auto">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1.5" style={{ fontFamily: "'Inter', sans-serif", fontStyle: 'normal' }}>
                Iniciar sesión
              </h1>
              <p className="text-sm text-white/40 tracking-tight">
                Ingresa tus credenciales
              </p>
            </div>

            <form onSubmit={manejarEnvio} className="flex flex-col gap-[18px]">
              {/* Campo correo electrónico */}
              <div className="space-y-1.5">
                <Label htmlFor="correo" className="text-xs font-medium text-white/50 tracking-wider uppercase">
                  Correo electrónico
                </Label>
                <Input
                  id="correo"
                  type="email"
                  autoComplete="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  disabled={cargando}
                  placeholder="admin@loyolamotors.com"
                  className="h-[46px] px-3.5 border-white/10 rounded-[10px] text-sm text-foreground bg-white/5 placeholder:text-white/20 transition-colors duration-200 focus:border-primary/50 focus:bg-white/[0.08] focus-visible:ring-0"
                />
              </div>

              {/* Campo contraseña */}
              <div className="space-y-1.5">
                <Label htmlFor="contrasena" className="text-xs font-medium text-white/50 tracking-wider uppercase">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="contrasena"
                    type={mostrarContrasena ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    disabled={cargando}
                    placeholder="••••••••"
                    className="h-[46px] px-3.5 pr-11 border-white/10 rounded-[10px] text-sm text-foreground bg-white/5 placeholder:text-white/20 transition-colors duration-200 focus:border-primary/50 focus:bg-white/[0.08] focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-white/35 p-1 leading-none hover:text-white/60 transition-colors"
                    aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {mostrarContrasena ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="px-3.5 py-2.5 bg-[rgba(255,61,36,0.1)] border border-[rgba(255,61,36,0.25)] rounded-[10px] text-[#ff6b4a] text-[13px] text-center">
                  {error}
                </div>
              )}

              {/* Botón de envío */}
              <Button
                type="submit"
                disabled={cargando}
                className={`w-full h-[46px] flex items-center justify-center gap-2 rounded-[10px] text-sm font-semibold tracking-tight mt-1 transition-all duration-250 ${
                  cargando
                    ? 'bg-white/10 cursor-not-allowed shadow-none'
                    : 'bg-[#DC2626] text-white shadow-[0_4px_20px_rgba(255,61,36,0.3)] hover:bg-[#e8341e] hover:shadow-[0_6px_28px_rgba(255,61,36,0.45)] hover:-translate-y-px active:translate-y-0'
                }`}
              >
                {cargando ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    Iniciar sesión
                    <span className="text-[15px]">→</span>
                  </>
                )}
              </Button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-[11px] text-white/25 tracking-wide">
                Acceso exclusivo para personal autorizado
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
