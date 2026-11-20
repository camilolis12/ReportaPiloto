import React from 'react';
import { LogOut, ShieldCheck, UserCheck, Building2 } from 'lucide-react';

export default function Navbar({
  session,
  activeView,
  campusTotal,
  onLogout,
  onGoHome,
  onGoCampusReports,
}) {
  const isAdmin = session?.role === 'bienestar';

  return (
    <header
      className="w-full max-w-[960px] mx-auto px-3 sm:px-6 z-20"
      style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
    >
      <nav
        aria-label="Navegación principal"
        className="elegant-panel px-2.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 relative overflow-hidden"
      >
        {/* Destello superior sutil en Rojo UniPiloto (#c60000) */}
        <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#c60000]/80 to-transparent" />

        {/* BOCETO 2 (Izquierda): logo unipiloto */}
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center group cursor-pointer focus:outline-none shrink-0 select-none"
          title="Ir al inicio de ReportaPiloto"
        >
          <div className="bg-[#ffffff] matter-bevel rounded-[10px] sm:rounded-[13px] px-2.5 sm:px-3.5 py-1 sm:py-1.5 border border-white/90 flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]">
            <img
              src="/logo-unipiloto.png"
              alt="Logo UniPiloto"
              width="601"
              height="248"
              className="h-7 sm:h-9 w-auto object-contain"
            />
          </div>
        </button>

        {/* BOCETO 2 (Derecha): Acceso separado a Campus + Rol + ReportaPiloto + Cerrar sesión */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          {/* Acceso independiente a Reportes de Todo el Campus */}
          <button
            type="button"
            onClick={onGoCampusReports}
            aria-label="Reportes de Todo el Campus"
            className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-[300px] px-2.5 sm:px-3.5 py-1.5 text-[12px] font-medium transition-all cursor-pointer border shrink-0 select-none ${
              activeView === 'campus-reportes'
                ? 'bg-[#c60000] text-[#ffffff] border-[#ffc9c9] matter-bevel font-semibold'
                : 'bg-[#141416] hover:bg-[#1f1f22] text-[#e5e5e5] border-white/12 hover:border-white/25'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#ffc9c9]" strokeWidth={2} />
            <span className="hidden md:inline">Reportes del Campus</span>
            <span className="rounded-[300px] bg-[#fff5dd] text-[#000000] px-1.5 sm:px-2 text-[10px] sm:text-[11px] font-bold leading-[1.6] tabular-nums">
              {campusTotal ?? 0}
            </span>
          </button>

          {/* Insignia de Rol */}
          <div
            className={`hidden lg:inline-flex items-center gap-1.5 rounded-[300px] matter-bevel px-3.5 py-1 text-[12px] font-medium ${
              isAdmin
                ? 'bg-[#ffe5e5] text-[#000000] border border-[#ffc9c9]'
                : 'bg-[#edf7ff] text-[#000000] border border-[#ffffff]'
            }`}
          >
            {isAdmin ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#c60000]" strokeWidth={2} />
            ) : (
              <UserCheck className="w-3.5 h-3.5 text-[#313233]" strokeWidth={2} />
            )}
            <span className="max-w-[140px] truncate">{session?.email}</span>
          </div>

          {/* Título derecho del Boceto 2: ReportaPiloto */}
          <button
            type="button"
            onClick={onGoHome}
            className="text-[15px] sm:text-[20px] font-semibold tracking-[-0.03em] text-[#fafafa] cursor-pointer select-none flex items-center hover:opacity-90 transition-opacity whitespace-nowrap px-0.5"
          >
            <span>Reporta</span>
            <span className="text-[#ffc9c9] font-normal">Piloto</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#c60000] ml-1.5 shadow-[0_0_8px_#c60000]" />
          </button>

          {/* Botón para cerrar sesión con contraste mejorado */}
          <button
            type="button"
            onClick={onLogout}
            title={`Cerrar sesión (${session?.email})`}
            aria-label="Cerrar sesión"
            className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-[300px] bg-white/[0.06] hover:bg-[#c60000] border border-white/15 hover:border-[#ffc9c9] text-[#e5e5e5] hover:text-[#ffffff] transition-all cursor-pointer shrink-0 select-none"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.85} />
          </button>
        </div>
      </nav>
    </header>
  );
}
