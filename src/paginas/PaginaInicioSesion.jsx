
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAutenticacion } from '../contextos/ContextoAutenticacion';
import Orb from '../components/Orb/Orb';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@lexusfx.com');
  const [password, setPassword] = useState('Admin2025');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAutenticacion();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Orb — hue 200 rotaciona roxo/azul base para vermelho/laranja (#ff3d24 territory) */}
      <div style={{
        position: 'absolute',
        width: '1100px',
        height: '1100px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -40%)',
        zIndex: 0,
        opacity: 0.45,
        pointerEvents: 'none',
      }}>
        <Orb
          hue={200}
          hoverIntensity={1.8}
          rotateOnHover={false}
          forceHoverState={true}
          backgroundColor="#0a0a0a"
        />
      </div>

      {/* Card — glassmorphism escuro coeso com o fundo */}
      <div className="login-double-card" style={{
        width: '100%',
        maxWidth: '880px',
        background: 'rgba(18, 18, 18, 0.75)',
        backdropFilter: 'blur(40px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.4)',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        display: 'grid',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Painel Esquerdo — Branding */}
        <div className="login-left-panel" style={{
          position: 'relative',
          minHeight: '520px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute',
            inset: '14px',
            borderRadius: '14px',
            overflow: 'hidden',
            background: 'linear-gradient(160deg, #1a0a08 0%, #2a0e0a 30%, #1c1210 70%, #0d0a09 100%)',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 80%, rgba(255,61,36,0.18), transparent 70%)',
            }} />
            <div style={{
              position: 'absolute',
              top: 0,
              left: '20%',
              right: '20%',
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(255,61,36,0.3), transparent)',
            }} />
          </div>

          <div style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            maxWidth: '340px',
          }}>
            <div style={{ marginBottom: '28px' }}>
              <img
                src="/assets/img/icon/loyola-logo-v2.png"
                alt="Loyola Motors Logo"
                style={{
                  height: '72px',
                  margin: '0 auto',
                  display: 'block',
                  filter: 'drop-shadow(0 4px 12px rgba(255,61,36,0.15))',
                }}
              />
            </div>
            <h2 style={{
              fontSize: '26px',
              fontWeight: '600',
              lineHeight: '1.25',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 14px 0',
            }}>
              Panel de administración
            </h2>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: '1.6',
              letterSpacing: '-0.01em',
              margin: 0,
            }}>
              Gestiona facturas, clientes y servicios de Loyola Motors desde un solo lugar.
            </p>
          </div>
        </div>

        {/* Painel Direito — Formulário */}
        <div className="login-right-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '32px 36px',
        }}>
          <div style={{ width: '100%', maxWidth: '360px', margin: '0 auto' }}>
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                letterSpacing: '-0.02em',
                margin: '0 0 6px 0',
              }}>
                Iniciar sesión
              </h1>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '-0.01em',
                margin: 0,
              }}>
                Ingresa tus credenciales
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '6px',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="admin@loyolamotors.com"
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#ffffff',
                    background: 'rgba(255,255,255,0.05)',
                    outline: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255,61,36,0.5)';
                    e.target.style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '6px',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      height: '46px',
                      padding: '0 42px 0 14px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#ffffff',
                      background: 'rgba(255,255,255,0.05)',
                      outline: 'none',
                      transition: 'border-color 0.2s, background 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(255,61,36,0.5)';
                      e.target.style.background = 'rgba(255,255,255,0.08)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.target.style.background = 'rgba(255,255,255,0.05)';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'rgba(255,255,255,0.35)',
                      fontSize: '18px',
                      padding: '4px',
                      lineHeight: 1,
                    }}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? '◡' : '◉'}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(255,61,36,0.1)',
                  border: '1px solid rgba(255,61,36,0.25)',
                  borderRadius: '10px',
                  color: '#ff6b4a',
                  fontSize: '13px',
                  textAlign: 'center',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="login-submit-btn"
                style={{
                  width: '100%',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: isLoading ? 'rgba(255,255,255,0.1)' : '#ff3d24',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  letterSpacing: '-0.01em',
                  transition: 'all 0.25s ease',
                  marginTop: '4px',
                  boxShadow: isLoading ? 'none' : '0 4px 20px rgba(255,61,36,0.3)',
                }}
              >
                {isLoading ? (
                  <>
                    <span style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite',
                    }} />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    Iniciar sesión
                    <span style={{ fontSize: '15px' }}>→</span>
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.25)',
                margin: 0,
                letterSpacing: '0.01em',
              }}>
                Acceso exclusivo para personal autorizado
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .login-double-card {
          grid-template-columns: 1.1fr 1fr;
        }
        .login-submit-btn:not(:disabled):hover {
          background: #e8341e !important;
          box-shadow: 0 6px 28px rgba(255,61,36,0.45) !important;
          transform: translateY(-1px);
        }
        .login-submit-btn:not(:disabled):active {
          transform: translateY(0);
        }
        input::placeholder {
          color: rgba(255,255,255,0.2) !important;
        }
        @media (max-width: 768px) {
          .login-double-card {
            grid-template-columns: 1fr !important;
          }
          .login-left-panel {
            min-height: 280px !important;
          }
          .login-right-panel {
            padding: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
