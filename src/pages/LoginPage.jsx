
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CommonPageHero from '@/components/CommonPageHero/CommonPageHero';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@loyolamotors.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/invoices";

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
    <>
      <CommonPageHero title="Iniciar sesión" />
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div>
            <h2 style={{ marginTop: '24px', textAlign: 'center', fontSize: '30px', fontWeight: 'bold', color: '#111827' }}>
              Iniciar sesión
            </h2>
            <p style={{ marginTop: '8px', textAlign: 'center', fontSize: '14px', color: '#4b5563' }}>
              Área de administración
            </p>
          </div>
          <form style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }} onSubmit={handleSubmit}>
            <div style={{ borderRadius: '6px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
              <div>
                <label htmlFor="email" style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: '0' }}>
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  style={{ appearance: 'none', position: 'relative', display: 'block', width: '100%', padding: '12px', border: '1px solid #d1d5db', color: '#111827', borderTopLeftRadius: '6px', borderTopRightRadius: '6px', outline: 'none' }}
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: '0' }}>
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  style={{ appearance: 'none', position: 'relative', display: 'block', width: '100%', padding: '12px', border: '1px solid #d1d5db', color: '#111827', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px', outline: 'none' }}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="common-btn"
                style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', padding: '12px 24px', fontSize: '14px', fontWeight: '500', borderRadius: '6px' }}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
