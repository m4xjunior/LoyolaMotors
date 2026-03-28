import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAutenticacion } from "../contextos/ContextoAutenticacion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignIn } from "@phosphor-icons/react";

export default function PaginaInicioSesion() {
  const [email, setEmail] = useState("admin@lexusfx.com");
  const [password, setPassword] = useState("Admin2025");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAutenticacion();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
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
    <div className="min-h-screen bg-[var(--fondo)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <img
              src="/assets/img/icon/loyola-logo-v2.png"
              alt="Loyola Motors"
              className="h-16 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[var(--texto-principal)]">
            Loyola Motors
          </CardTitle>
          <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
            Panel de Administracion
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                Correo electronico
              </label>
              <Input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="admin@loyolamotors.com"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                Contrasena
              </label>
              <Input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                className="bg-[var(--fondo-tarjeta)] border-[var(--borde)] text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)]"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90 mt-2"
            >
              {isLoading ? (
                "Iniciando sesion..."
              ) : (
                <>
                  <SignIn className="mr-2 size-4" />
                  Iniciar sesion
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-[var(--texto-deshabilitado)] mt-5">
            Acceso exclusivo para personal autorizado
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
