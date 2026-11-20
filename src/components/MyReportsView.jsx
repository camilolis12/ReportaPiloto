import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  PlusCircle,
  Lightbulb,
  Wrench,
  Footprints,
  Trash2,
  MapPin,
  Clock,
  UserCheck,
  Search,
  CheckCircle2,
  Eye,
  Hourglass,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { INCIDENT_CATEGORIES, REPORT_STATUSES } from '../constants/incidents.js';

const CATEGORY_ICON_MAP = {
  luminarias: Lightbulb,
  mobiliario_banos: Wrench,
  andenes_rampas: Footprints,
  basura_reciclaje: Trash2,
};

const CATEGORY_PASTEL_CHIP = {
  luminarias: 'bg-[#fff5dd] text-[#000000]',
  mobiliario_banos: 'bg-[#edf7ff] text-[#000000]',
  andenes_rampas: 'bg-[#eae8ff] text-[#000000]',
  basura_reciclaje: 'bg-[#ccfff3] text-[#000000]',
};

function formatRelativeDate(isoString) {
  if (!isoString) return 'Hace un momento';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return 'Reciente';

  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSeconds < 60) return 'Hace unos segundos';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MyReportsView({
  session,
  reports,
  onBack,
  onNewReport,
}) {
  const [statusFilter, setStatusFilter] = useState('todos');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  const myReports = useMemo(
    () => reports.filter((r) => r.authorEmail === session?.email),
    [reports, session]
  );

  const filteredReports = useMemo(() => {
    return myReports.filter((report) => {
      if (statusFilter !== 'todos' && report.status !== statusFilter) {
        return false;
      }
      if (categoryFilter !== 'todas' && report.categoryId !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchZone = report.zone?.toLowerCase().includes(q);
        const matchLoc = report.specificLocation?.toLowerCase().includes(q);
        const matchDesc = report.description?.toLowerCase().includes(q);
        if (!matchZone && !matchLoc && !matchDesc) {
          return false;
        }
      }
      return true;
    });
  }, [myReports, statusFilter, categoryFilter, searchQuery]);

  const myStats = useMemo(() => {
    const total = myReports.length;
    const pendientes = myReports.filter((r) => r.status === 'pendiente').length;
    const enRevision = myReports.filter((r) => r.status === 'en_revision').length;
    const resueltos = myReports.filter((r) => r.status === 'resuelto').length;
    return { total, pendientes, enRevision, resueltos };
  }, [myReports]);

  const getStatusBadgeStyle = (status) => {
    if (status === 'resuelto') {
      return {
        label: 'Resuelto',
        pillClass: 'bg-[#ccfff3] text-[#000000] border-[#ffffff]',
        accentBar: 'bg-[#ccfff3]',
        Icon: CheckCircle2,
      };
    }
    if (status === 'en_revision') {
      return {
        label: 'En revisión',
        pillClass: 'bg-[#fff5dd] text-[#000000] border-[#ffffff]',
        accentBar: 'bg-[#fff5dd]',
        Icon: Eye,
      };
    }
    return {
      label: 'Pendiente',
      pillClass: 'bg-[#ffe5e5] text-[#000000] border-[#ffc9c9]',
      accentBar: 'bg-[#c60000]',
      Icon: Hourglass,
    };
  };

  const getPriorityBadge = (priority) => {
    if (priority === 'alta') {
      return (
        <span className="inline-flex items-center gap-1 rounded-[300px] bg-[#c60000] text-[#ffffff] px-2.5 py-0.5 text-[11px] font-semibold">
          <AlertTriangle className="w-3 h-3" strokeWidth={2} />
          Urgente
        </span>
      );
    }
    if (priority === 'media') {
      return (
        <span className="inline-flex items-center rounded-[300px] bg-[#fff5dd] text-[#000000] px-2.5 py-0.5 text-[11px] font-medium">
          Prioridad Media
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-[300px] bg-[#edf7ff] text-[#000000] px-2.5 py-0.5 text-[11px] font-medium">
        Prioridad Baja
      </span>
    );
  };

  return (
    <div className="w-full max-w-[960px] mx-auto px-3 sm:px-6 py-4 sm:py-8 z-10 animate-fadeIn">
      {/* Navegación Superior */}
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <button
          type="button"
          onClick={onBack}
          className="btn-matter-dark inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-[13px] sm:text-[14px] font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#ffc9c9]" strokeWidth={2} />
          <span className="sm:hidden">Volver</span>
          <span className="hidden sm:inline">Volver al Inicio</span>
        </button>

        <button
          type="button"
          onClick={onNewReport}
          className="btn-unipiloto-red inline-flex items-center gap-2 px-4 sm:px-5 py-2 text-[13px] sm:text-[14px] font-semibold cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" strokeWidth={2.25} />
          <span>Nuevo Reporte</span>
        </button>
      </div>

      {/* Cabecera + KPIs Integrados en Panel Elegante */}
      <div className="elegant-panel p-4 sm:p-8 mb-4 sm:mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c60000] to-transparent" />

        <div className="space-y-2 mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 rounded-[300px] bg-[#edf7ff] text-[#000000] matter-bevel px-3 sm:px-3.5 py-1 text-[11px] sm:text-[12px] font-semibold max-w-full">
            <UserCheck className="w-3.5 h-3.5 text-[#c60000] shrink-0" strokeWidth={2} />
            <span className="truncate">Historial Personal · {session?.email}</span>
          </div>

          <h1 className="page-title font-semibold text-[#fafafa]">
            Mis Reportes
          </h1>

          <p className="text-[13px] sm:text-[15px] text-[#a1a1a1] max-w-2xl leading-[1.5]">
            Aquí aparecen exclusivamente las incidencias que tú has reportado y el estado actual de su atención.
          </p>
        </div>

        {/* 4 Indicadores con acentos pastel establecidos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-5 border-t border-white/[0.08]">
          <div className="rounded-[14px] sm:rounded-[18px] bg-[#edf7ff] text-[#000000] matter-bevel px-3.5 py-2.5 sm:px-4 sm:py-3.5 flex items-center justify-between gap-2 sm:block">
            <div className="micro-label text-[#313233]">Mis enviados</div>
            <div
              className="text-[20px] sm:text-[28px] font-bold text-[#000000] leading-tight sm:mt-0.5 tabular-nums"
              style={{ fontFamily: 'var(--font-geist)' }}
            >
              {myStats.total}
            </div>
          </div>

          <div className="rounded-[14px] sm:rounded-[18px] bg-[#ffe5e5] text-[#000000] border border-[#ffc9c9] matter-bevel px-3.5 py-2.5 sm:px-4 sm:py-3.5 flex items-center justify-between gap-2 sm:block">
            <div className="micro-label text-[#c60000] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c60000]" />
              Pendientes
            </div>
            <div
              className="text-[20px] sm:text-[28px] font-bold text-[#c60000] leading-tight sm:mt-0.5 tabular-nums"
              style={{ fontFamily: 'var(--font-geist)' }}
            >
              {myStats.pendientes}
            </div>
          </div>

          <div className="rounded-[14px] sm:rounded-[18px] bg-[#fff5dd] text-[#000000] matter-bevel px-3.5 py-2.5 sm:px-4 sm:py-3.5 flex items-center justify-between gap-2 sm:block">
            <div className="micro-label text-[#313233] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#313233]" />
              En revisión
            </div>
            <div
              className="text-[20px] sm:text-[28px] font-bold text-[#000000] leading-tight sm:mt-0.5 tabular-nums"
              style={{ fontFamily: 'var(--font-geist)' }}
            >
              {myStats.enRevision}
            </div>
          </div>

          <div className="rounded-[14px] sm:rounded-[18px] bg-[#ccfff3] text-[#000000] matter-bevel px-3.5 py-2.5 sm:px-4 sm:py-3.5 flex items-center justify-between gap-2 sm:block">
            <div className="micro-label text-[#313233] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#000000]" />
              Resueltos
            </div>
            <div
              className="text-[20px] sm:text-[28px] font-bold text-[#000000] leading-tight sm:mt-0.5 tabular-nums"
              style={{ fontFamily: 'var(--font-geist)' }}
            >
              {myStats.resueltos}
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros Limpia y Adaptable */}
      <div className="elegant-card p-3 sm:p-3.5 sm:px-5 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="scroll-row flex items-center gap-1.5 sm:flex-wrap">
          {[{ id: 'todos', label: 'Todos' }, ...REPORT_STATUSES].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id)}
              className={`shrink-0 whitespace-nowrap rounded-[300px] px-3.5 py-1.5 text-[12px] font-medium border transition-all cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-[#c60000] text-[#ffffff] border-[#ffc9c9] font-semibold shadow-sm'
                  : 'bg-[#141414] border-white/10 text-[#e5e5e5] hover:border-white/25'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 sm:justify-end">
          <select
            aria-label="Filtrar por categoría"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="matter-input branded-select rounded-[14px] sm:rounded-[300px] w-full sm:w-auto px-3.5 sm:px-4 py-2 sm:py-1.5 text-[13px] sm:text-[12px] cursor-pointer"
          >
            <option value="todas">Todas las categorías</option>
            {INCIDENT_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.shortLabel}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-56">
            <Search
              className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              strokeWidth={1.75}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en mis reportes..."
              className="matter-input rounded-[14px] sm:rounded-[300px] w-full pl-9 pr-4 py-2 sm:py-1.5 text-[13px] sm:text-[12px] placeholder-[#737373]"
            />
          </div>
        </div>
      </div>

      {/* Listado de Mis Reportes */}
      {filteredReports.length === 0 ? (
        <div className="elegant-panel p-6 sm:p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#ffe5e5] text-[#c60000] matter-bevel mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" strokeWidth={2} />
          </div>
          <div className="space-y-1">
            <h2 className="text-[17px] sm:text-[20px] font-medium text-[#fafafa]">
              {myReports.length === 0
                ? 'Aún no has creado ningún reporte con tu cuenta'
                : 'No hay coincidencias con el filtro seleccionado'}
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#a1a1a1] max-w-md mx-auto">
              Cuando registres un incidente en el campus, aparecerá aquí con su seguimiento en tiempo real.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={onNewReport}
              className="btn-unipiloto-red px-6 py-2.5 text-[14px] font-semibold cursor-pointer"
            >
              Crear mi primer reporte
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredReports.map((report, index) => {
            const formattedIndex = String(index + 1).padStart(2, '0');
            const CategoryIcon = CATEGORY_ICON_MAP[report.categoryId] || Lightbulb;
            const categoryChipClass =
              CATEGORY_PASTEL_CHIP[report.categoryId] || 'bg-[#edf7ff] text-[#000000]';
            const statusMeta = getStatusBadgeStyle(report.status);
            const StatusIcon = statusMeta.Icon;

            return (
              <article
                key={report.id}
                className="elegant-card p-4 sm:p-6 relative overflow-hidden space-y-3 sm:space-y-4"
              >
                {/* Barra lateral sutil según estado */}
                <div
                  className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${statusMeta.accentBar}`}
                />

                {/* Encabezado de tarjeta adaptable */}
                <div className="space-y-2.5 sm:space-y-0 sm:flex sm:items-start sm:justify-between sm:gap-4">
                  <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0 flex-1">
                    <div className="flex items-center sm:items-start gap-3 min-w-0 flex-1">
                      <span
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-[12px] sm:rounded-[14px] flex items-center justify-center shrink-0 sm:mt-0.5 matter-bevel ${categoryChipClass}`}
                      >
                        <CategoryIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                      </span>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-[12px] font-bold text-[#ffc9c9] tabular-nums"
                            style={{ fontFamily: 'var(--font-geist)' }}
                          >
                            #{formattedIndex}
                          </span>
                          {getPriorityBadge(report.priority)}
                        </div>

                        <h3 className="hidden sm:block text-[18px] sm:text-[19px] font-semibold text-[#fafafa] leading-[1.35]">
                          {report.categoryLabel}
                        </h3>
                      </div>
                    </div>

                    {/* Estado visible arriba a la derecha en celulares */}
                    <div
                      className={`sm:hidden inline-flex items-center gap-1.5 rounded-[300px] border matter-bevel px-3 py-1 text-[11px] font-semibold shrink-0 ${statusMeta.pillClass}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" strokeWidth={2} />
                      <span>{statusMeta.label}</span>
                    </div>
                  </div>

                  {/* Título de ancho completo en celulares (sin quedar apretado) */}
                  <h3 className="sm:hidden text-[15px] font-semibold text-[#fafafa] leading-[1.35]">
                    {report.categoryLabel}
                  </h3>

                  {/* Estado en escritorio */}
                  <div
                    className={`hidden sm:inline-flex items-center gap-2 rounded-[300px] border matter-bevel px-4 py-1.5 text-[12px] font-semibold shrink-0 ${statusMeta.pillClass}`}
                  >
                    <StatusIcon className="w-4 h-4" strokeWidth={2} />
                    <span>{statusMeta.label}</span>
                  </div>
                </div>

                <div className="space-y-3 pl-0 sm:pl-14">
                  <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 max-w-full rounded-[10px] bg-[#141414] border border-white/10 px-3 sm:px-3.5 py-1.5 text-[12px] sm:text-[13px] text-[#fafafa]">
                    <MapPin className="w-4 h-4 text-[#ffc9c9] shrink-0" strokeWidth={2} />
                    <span className="font-medium">{report.zone}</span>
                    <span className="text-[#737373]">·</span>
                    <span className="text-[#e5e5e5]">{report.specificLocation}</span>
                  </div>

                  <p className="text-[14px] sm:text-[15px] text-[#e5e5e5] leading-[1.5]">
                    {report.description}
                  </p>

                  {report.photoDataUrl && (
                    <div className="pt-1">
                      <img
                        src={report.photoDataUrl}
                        alt="Evidencia del reporte"
                        loading="lazy"
                        className="max-h-48 sm:max-h-60 w-full sm:w-auto rounded-[12px] sm:rounded-[16px] border border-white/15 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 flex-wrap pt-1 text-[12px] text-[#a1a1a1]">
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 min-w-0">
                      <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span>Enviado {formatRelativeDate(report.createdAt)}</span>
                    </div>

                    {report.updatedBy && (
                      <span className="rounded-[300px] bg-[#eae8ff] text-[#000000] px-2.5 py-0.5 text-[11px] font-medium">
                        Revisado por {report.updatedBy}
                      </span>
                    )}
                  </div>
                </div>

                {/* Barra de Progreso de Seguimiento (3 Etapas) */}
                <div className="pt-3 border-t border-white/[0.07]">
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[11px] sm:text-[12px]">
                    <div
                      className={`rounded-[300px] py-1.5 px-1.5 sm:px-3 text-center whitespace-nowrap border transition-all ${
                        report.status === 'pendiente'
                          ? 'bg-[#ffe5e5] text-[#000000] font-semibold border-[#ffc9c9] matter-bevel'
                          : 'bg-[#141414] text-[#737373] border-white/[0.06]'
                      }`}
                    >
                      1. Pendiente
                    </div>
                    <div
                      className={`rounded-[300px] py-1.5 px-1.5 sm:px-3 text-center whitespace-nowrap border transition-all ${
                        report.status === 'en_revision'
                          ? 'bg-[#fff5dd] text-[#000000] font-semibold border-[#ffffff] matter-bevel'
                          : 'bg-[#141414] text-[#737373] border-white/[0.06]'
                      }`}
                    >
                      2. En revisión
                    </div>
                    <div
                      className={`rounded-[300px] py-1.5 px-1.5 sm:px-3 text-center whitespace-nowrap border transition-all ${
                        report.status === 'resuelto'
                          ? 'bg-[#ccfff3] text-[#000000] font-semibold border-[#ffffff] matter-bevel'
                          : 'bg-[#141414] text-[#737373] border-white/[0.06]'
                      }`}
                    >
                      3. Resuelto
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
