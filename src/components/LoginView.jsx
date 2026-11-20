import React, { useState } from 'react';
import { Check, Eye, EyeOff, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';

const ALLOWED_DOMAINS = ['@upc.edu.co', '@pilotobienestar.edu.co'];

export default function LoginView({ onLogin }) {
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [customError, setCustomError] = useState('');

  const syncAriaInvalid = (event) => {
    const el = event.currentTarget;
    if (!el || typeof el.matches !== 'function') return;
    try {
      const isUserInvalid = el.matches(':user-invalid');
      el.setAttribute('aria-invalid', isUserInvalid ? 'true' : 'false');
    } catch {
      el.setAttribute('aria-invalid', !el.checkValidity() ? 'true' : 'false');
    }
  };

  const cleanEmail = emailInput.trim().toLowerCase();

  const detectedRole = cleanEmail.endsWith('@pilotobienestar.edu.co')
    ? 'bienestar'
    : cleanEmail.endsWith('@upc.edu.co') || (!cleanEmail.includes('@') && cleanEmail.length > 0)
    ? 'comunidad'
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setCustomError('');

    let resolvedEmail = cleanEmail;
    if (!resolvedEmail.includes('@')) {
      resolvedEmail = `${resolvedEmail}@upc.edu.co`;
    }

    const matchedDomain = ALLOWED_DOMAINS.find((domain) => resolvedEmail.endsWith(domain));

    if (!matchedDomain) {
      setCustomError(
        'Ingresa un correo institucional válido: @upc.edu.co o @pilotobienestar.edu.co'
      );
      return;
    }

    const localPart = resolvedEmail.slice(0, -matchedDomain.length);
    if (!localPart || localPart.length < 2) {
      setCustomError('Ingresa el usuario antes del dominio.');
      return;
    }

    if (!password || password.trim().length < 4) {
      setCustomError('Ingresa tu contraseña institucional.');
      return;
    }

    const role = matchedDomain === '@pilotobienestar.edu.co' ? 'bienestar' : 'comunidad';
    const displayName = localPart
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    onLogin({
      email: resolvedEmail,
      username: localPart,
      displayName: displayName || localPart,
      domain: matchedDomain,
      role,
      roleLabel:
        role === 'bienestar'
          ? 'Bienestar / Administración'
          : 'Comunidad Universitaria',
      loggedAt: new Date().toISOString(),
    });
  };

  return (
    <main className="min-h-dvh bg-[#0a0a0a] text-[#fafafa] flex flex-col items-center justify-center px-5 py-10 sm:py-12 relative overflow-hidden">
      {/* Halo atmosférico institucional (#c60000 + suaves matices pastel) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] sm:w-[640px] sm:h-[640px] rounded-full opacity-30 blur-[110px] sm:blur-[150px]"
        style={{
          background:
            'radial-gradient(circle, rgba(198, 0, 0, 0.44) 0%, rgba(255, 201, 201, 0.12) 45%, rgba(10, 10, 10, 0) 72%)',
        }}
      />

      <div className="w-full max-w-[390px] sm:max-w-[420px] z-10 flex flex-col items-center gap-4 sm:gap-5 animate-fadeIn">
        {/* BOCETO 1: Logo Oficial en superficie blanca de porcelana limpia y minimalista */}
        <div className="w-full relative group select-none">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-1 rounded-[26px] bg-gradient-to-b from-[#c60000]/25 via-transparent to-[#c60000]/15 blur-xl opacity-80"
          />
          <div className="relative bg-[#ffffff] matter-bevel rounded-[20px] sm:rounded-[24px] px-8 py-6 sm:px-10 sm:py-8 border border-white/85 flex items-center justify-center overflow-hidden shadow-[0_24px_56px_-12px_rgba(0,0,0,0.8)]">
            <img
              src="/logo-unipiloto.png"
              alt="Universidad Piloto de Colombia"
              width="601"
              height="248"
              className="h-20 sm:h-32 w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* BOCETO 1: Contenedor minimalista de acceso ([ @upc.edu.co ] + [ password ] [ ✓ ]) */}
        <div className="w-full elegant-panel p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#c60000]/80 to-transparent" />

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">
            {/* Recuadro superior: [ @upc.edu.co ] */}
            <div className="field-group">
              <input
                id="institutional-email"
                name="email"
                type="text"
                required
                aria-label="Correo institucional"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setCustomError('');
                }}
                onBlur={syncAriaInvalid}
                onInput={syncAriaInvalid}
                autoComplete="off"
                spellCheck="false"
                autoCapitalize="none"
                autoCorrect="off"
                enterKeyHint="next"
                placeholder="@upc.edu.co"
                className="dimension-input matter-input rounded-[14px] sm:rounded-[16px] w-full px-4 sm:px-4.5 py-3.5 text-[16px] placeholder-[#737373]"
              />
            </div>

            {/* Fila inferior: [ password ]  [ ✓ ] */}
            <div className="flex items-stretch gap-2.5 sm:gap-3">
              <div className="field-group relative flex-1">
                <input
                  id="institutional-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={4}
                  aria-label="Contraseña institucional"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setCustomError('');
                  }}
                  onBlur={syncAriaInvalid}
                  onInput={syncAriaInvalid}
                  autoComplete="off"
                  enterKeyHint="done"
                  placeholder="password"
                  className="dimension-input matter-input rounded-[14px] sm:rounded-[16px] w-full px-4 sm:px-4.5 py-3.5 pr-11 text-[16px] placeholder-[#737373]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#a1a1a1] hover:text-[#fafafa] transition-colors cursor-pointer select-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.75} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.75} />
                  )}
                </button>
              </div>

              {/* Botón [ ✓ ] en Rojo Institucional UniPiloto (#c60000 -> #930000) */}
              <button
                type="submit"
                aria-label="Iniciar sesión"
                title="Ingresar"
                className="w-[54px] sm:w-[58px] shrink-0 rounded-[14px] sm:rounded-[16px] bg-gradient-to-b from-[#da0000] via-[#c60000] to-[#980000] hover:from-[#bd0000] hover:to-[#930000] text-[#ffffff] border border-[#ffc9c9]/60 shadow-[0_8px_22px_-4px_rgba(198,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.3)] active:scale-[0.96] transition-all duration-200 flex items-center justify-center cursor-pointer select-none"
              >
                <Check className="w-6 h-6" strokeWidth={2.75} />
              </button>
            </div>

            {/* Error de validación */}
            {customError && (
              <div
                role="alert"
                className="flex items-center gap-2.5 rounded-[14px] bg-[#ffe5e5] text-[#000000] border border-[#ffc9c9] matter-bevel px-4 py-3 text-[12px] font-medium animate-fadeIn"
              >
                <AlertCircle className="w-4 h-4 text-[#c60000] shrink-0" strokeWidth={2} />
                <span>{customError}</span>
              </div>
            )}

            {/* Indicador sutil de rol detectado */}
            {detectedRole && (
              <div className="pt-1 flex justify-center animate-fadeIn select-none">
                {detectedRole === 'bienestar' ? (
                  <span className="inline-flex items-center gap-1.5 rounded-[300px] bg-[#eae8ff] text-[#000000] matter-bevel px-3.5 py-1 text-[12px] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c60000]" strokeWidth={2} />
                    <span>Rol Bienestar / Administración</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-[300px] bg-[#edf7ff] text-[#000000] matter-bevel px-3.5 py-1 text-[12px] font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#c60000]" strokeWidth={2} />
                    <span>Comunidad Universitaria</span>
                  </span>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
