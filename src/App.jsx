import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  ClipboardList,
  CheckCircle2,
  Building2,
  ArrowUpRight,
} from 'lucide-react';
import LoginView from './components/LoginView.jsx';
import Navbar from './components/Navbar.jsx';
import CampusHeroCard from './components/CampusHeroCard.jsx';
import ReportView from './components/ReportView.jsx';
import MyReportsView from './components/MyReportsView.jsx';
import CampusReportsView from './components/CampusReportsView.jsx';
import { useRealtimeReports } from './hooks/useRealtimeReports.js';

const SESSION_STORAGE_KEY = 'reporta_unipiloto_session_v1';

export default function App() {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeView, setActiveView] = useState('home'); // 'home' | 'reporta' | 'mis-reportes' | 'campus-reportes'

  const {
    reports,
    stats,
    realtimeNotice,
    dismissNotice,
    createReport,
    updateReportStatus,
    deleteReport,
  } = useRealtimeReports(session);

  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [session]);

  const handleLogin = (userData) => {
    setSession(userData);
    setActiveView('home');
  };

  const handleLogout = () => {
    setSession(null);
    setActiveView('home');
  };

  if (!session) {
    return <LoginView onLogin={handleLogin} />;
  }

  const isAdmin = session.role === 'bienestar';
  const myOwnReportsCount = reports.filter((r) => r.authorEmail === session.email).length;

  return (
    <div className="min-h-dvh bg-[#0a0a0a] text-[#fafafa] flex flex-col justify-between relative overflow-x-hidden">
      {/* Iluminación ambiental superior en Rojo Institucional (#c60000) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[860px] h-[360px] rounded-full opacity-25 blur-[145px]"
        style={{
          background:
            'radial-gradient(circle, rgba(198, 0, 0, 0.42) 0%, rgba(234, 232, 255, 0.08) 50%, rgba(10, 10, 10, 0) 75%)',
        }}
      />

      {/* BOCETO 2 (Arriba): Barra superior con logo unipiloto a la izquierda y ReportaPiloto a la derecha */}
      <Navbar
        session={session}
        activeView={activeView}
        campusTotal={stats.total}
        onLogout={handleLogout}
        onGoHome={() => setActiveView('home')}
        onGoCampusReports={() => setActiveView('campus-reportes')}
      />

      {/* Notificación flotante en Tiempo Real */}
      {realtimeNotice && (
        <div className="w-full max-w-[960px] mx-auto px-3 sm:px-6 pt-3 z-20 flex justify-center">
          <div
            role="status"
            className="inline-flex items-center gap-2.5 max-w-full rounded-[16px] sm:rounded-[300px] bg-[#ccfff3] text-[#000000] border border-[#ffffff] matter-bevel px-4 py-1.5 text-[12px] font-semibold animate-fadeIn"
          >
            <CheckCircle2 className="w-4 h-4 text-[#000000] shrink-0" strokeWidth={2.25} />
            <span>{realtimeNotice.message}</span>
            <button
              type="button"
              onClick={dismissNotice}
              className="rounded-[300px] bg-[#171717] text-[#fafafa] px-2.5 py-0.5 text-[10px] hover:bg-[#000000] ml-1 cursor-pointer select-none"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* PÁGINAS COMPLETAS SEPARADAS */}
      {activeView === 'reporta' ? (
        <main className="flex-1 w-full flex items-start justify-center">
          <ReportView
            session={session}
            onBack={() => setActiveView('home')}
            onSubmitReport={(payload) => {
              const res = createReport(payload);
              if (res?.ok) {
                setActiveView('mis-reportes');
              }
              return res;
            }}
          />
        </main>
      ) : activeView === 'mis-reportes' ? (
        <main className="flex-1 w-full flex items-start justify-center">
          <MyReportsView
            session={session}
            reports={reports}
            onBack={() => setActiveView('home')}
            onNewReport={() => setActiveView('reporta')}
          />
        </main>
      ) : activeView === 'campus-reportes' ? (
        <main className="flex-1 w-full flex items-start justify-center">
          <CampusReportsView
            session={session}
            reports={reports}
            stats={stats}
            onBack={() => setActiveView('home')}
            onNewReport={() => setActiveView('reporta')}
            onUpdateStatus={updateReportStatus}
            onDeleteReport={deleteReport}
          />
        </main>
      ) : (
        /* BOCETO 2: Dashboard Principal (Foto de la U limpia + Dos Botones Principales Elegantes) */
        <main className="flex-1 w-full max-w-[960px] mx-auto px-3 sm:px-6 py-4 sm:py-8 flex flex-col justify-center gap-4 sm:gap-6 z-10 animate-fadeIn">
          {/* Marco Central: Foto de la U completamente limpia */}
          <CampusHeroCard />

          {/* BOCETO 2 (Abajo): Dos botones principales lado a lado ("Reporta" y "Mis Reportes") */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:pt-1">
            {/* Botón Izquierdo: Reporta */}
            <button
              type="button"
              onClick={() => setActiveView('reporta')}
              className="btn-unipiloto-red rounded-[18px] sm:rounded-[300px] group relative px-3 sm:px-7 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3.5 text-[15px] sm:text-[19px] font-semibold tracking-[-0.02em] cursor-pointer select-none"
            >
              <span className="w-9 h-9 rounded-[300px] bg-[#ffe5e5] text-[#c60000] matter-bevel flex items-center justify-center transition-transform duration-300 group-hover:rotate-90">
                <PlusCircle className="w-5 h-5" strokeWidth={2.25} />
              </span>
              <span>Reporta</span>
            </button>

            {/* Botón Derecho: Mis Reportes */}
            <button
              type="button"
              onClick={() => setActiveView('mis-reportes')}
              className="btn-matter-dark rounded-[18px] sm:rounded-[300px] group relative px-3 sm:px-7 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3.5 text-[15px] sm:text-[19px] font-medium tracking-[-0.02em] cursor-pointer select-none"
            >
              <span className="w-9 h-9 rounded-[300px] bg-[#edf7ff] text-[#000000] matter-bevel flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <ClipboardList className="w-4 h-4 text-[#000000]" strokeWidth={2.2} />
              </span>
              <span className="inline-flex items-center gap-1.5 sm:gap-2.5">
                <span>Mis Reportes</span>
                <span className="rounded-[300px] bg-[#edf7ff] text-[#000000] px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-[12px] font-bold tabular-nums">
                  {myOwnReportsCount}
                </span>
              </span>
            </button>
          </div>

          {/* Acceso directo separado a Reportes de Todo el Campus */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setActiveView('campus-reportes')}
              className="group w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-2.5 rounded-[16px] sm:rounded-[300px] bg-[#141416]/90 hover:bg-[#1b1b1e] border border-white/12 hover:border-white/25 px-4 sm:px-5 py-3 sm:py-2.5 text-[13px] font-medium text-[#e5e5e5] hover:text-white transition-all cursor-pointer shadow-sm select-none"
            >
              <span className="inline-flex items-center gap-2.5 min-w-0">
                <Building2 className="w-4 h-4 text-[#ffc9c9] shrink-0" strokeWidth={2} />
                <span className="truncate">
                  <span className="sm:hidden">
                    {isAdmin ? 'Gestionar Reportes del Campus' : 'Reportes de Todo el Campus'}
                  </span>
                  <span className="hidden sm:inline">
                    {isAdmin
                      ? 'Gestionar Reportes de Todo el Campus (Modo Bienestar)'
                      : 'Ver Reportes de Todo el Campus'}
                  </span>
                </span>
              </span>
              <span className="inline-flex items-center gap-2 shrink-0">
                <span className="rounded-[300px] bg-[#fff5dd] text-[#000000] px-2.5 py-0.5 text-[11px] font-bold tabular-nums">
                  {stats.total}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#a1a1a1] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>
        </main>
      )}

      {/* Pie de página minimalista */}
      <footer className="w-full max-w-[960px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-0.5 text-[11px] sm:text-[12px] text-[#737373] border-t border-white/[0.06]">
        <span className="text-[#a1a1a1]">
          Reporta UniPiloto · Universidad Piloto de Colombia
        </span>
        <span>
          Sesión activa:{' '}
          <strong className="text-[#e5e5e5] font-medium">{session.roleLabel}</strong>
        </span>
      </footer>
    </div>
  );
}
