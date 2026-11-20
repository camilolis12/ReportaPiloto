import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { INITIAL_SEED_REPORTS, INCIDENT_CATEGORIES } from '../constants/incidents.js';

const STORAGE_KEY = 'reporta_unipiloto_reports_v1';
const CHANNEL_NAME = 'reporta_unipiloto_realtime_v1';

function loadInitialReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_REPORTS));
      return INITIAL_SEED_REPORTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SEED_REPORTS;
  } catch {
    return INITIAL_SEED_REPORTS;
  }
}

export function useRealtimeReports(session) {
  const [reports, setReports] = useState(loadInitialReports);
  const [realtimeNotice, setRealtimeNotice] = useState(null);
  const channelRef = useRef(null);

  const persistAndBroadcast = useCallback((nextReports, eventMeta) => {
    setReports(nextReports);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReports));
    } catch {
      // Ignorar errores de cuota si una foto es muy grande
    }
    if (channelRef.current) {
      try {
        channelRef.current.postMessage({
          type: 'REPORTS_SYNC',
          reports: nextReports,
          meta: eventMeta,
        });
      } catch {
        // Ignorar errores de BroadcastChannel
      }
    }
  }, []);

  useEffect(() => {
    let bc = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = bc;

      bc.onmessage = (event) => {
        if (event.data?.type === 'REPORTS_SYNC' && Array.isArray(event.data.reports)) {
          setReports(event.data.reports);
          if (event.data.meta?.message) {
            setRealtimeNotice({
              id: Date.now(),
              message: event.data.meta.message,
            });
          }
        }
      };
    }

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const updated = JSON.parse(event.newValue);
          if (Array.isArray(updated)) {
            setReports(updated);
          }
        } catch {
          // Ignorar JSON inválido
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      if (bc) {
        bc.close();
      }
    };
  }, []);

  // Auto-ocultar notificación en vivo después de 4.5s
  useEffect(() => {
    if (!realtimeNotice) return;
    const timer = setTimeout(() => {
      setRealtimeNotice(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [realtimeNotice]);

  // Cualquier miembro de la comunidad (@upc.edu.co o @pilotobienestar.edu.co) puede crear un reporte
  const createReport = useCallback(
    (payload) => {
      if (!session?.email) {
        return { ok: false, error: 'Debes iniciar sesión para reportar.' };
      }

      const categoryObj =
        INCIDENT_CATEGORIES.find((cat) => cat.id === payload.categoryId) ||
        INCIDENT_CATEGORIES[0];

      const newReport = {
        id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        categoryId: categoryObj.id,
        categoryLabel: categoryObj.label,
        zone: payload.zone,
        specificLocation: payload.specificLocation.trim(),
        priority: payload.priority || 'media',
        description: payload.description.trim(),
        photoDataUrl: payload.photoDataUrl || null,
        status: 'pendiente',
        authorEmail: session.email,
        authorName: session.displayName || session.username,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        updatedBy: null,
      };

      const nextReports = [newReport, ...reports];
      const message = `Nuevo reporte registrado en ${newReport.zone}`;
      persistAndBroadcast(nextReports, { message });
      setRealtimeNotice({ id: Date.now(), message });

      return { ok: true, report: newReport };
    },
    [reports, session, persistAndBroadcast]
  );

  // EXCLUSIVO para @pilotobienestar.edu.co (rol 'bienestar'): Cambiar estado (Pendiente -> En revisión -> Resuelto)
  const updateReportStatus = useCallback(
    (reportId, newStatus) => {
      if (session?.role !== 'bienestar') {
        return {
          ok: false,
          error:
            'Solo el personal de @pilotobienestar.edu.co puede cambiar el estado de los reportes.',
        };
      }

      const nextReports = reports.map((item) => {
        if (item.id !== reportId) return item;
        return {
          ...item,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          updatedBy: session.email,
        };
      });

      const statusName =
        newStatus === 'resuelto'
          ? 'Resuelto'
          : newStatus === 'en_revision'
          ? 'En revisión'
          : 'Pendiente';

      const message = `Estado actualizado a "${statusName}" por Bienestar`;
      persistAndBroadcast(nextReports, { message });
      setRealtimeNotice({ id: Date.now(), message });

      return { ok: true };
    },
    [reports, session, persistAndBroadcast]
  );

  // EXCLUSIVO para @pilotobienestar.edu.co (rol 'bienestar'): Eliminar reportes
  const deleteReport = useCallback(
    (reportId) => {
      if (session?.role !== 'bienestar') {
        return {
          ok: false,
          error: 'Solo el personal de @pilotobienestar.edu.co tiene permiso para eliminar reportes.',
        };
      }

      const nextReports = reports.filter((item) => item.id !== reportId);
      const message = 'Reporte eliminado por administración de Bienestar';
      persistAndBroadcast(nextReports, { message });
      setRealtimeNotice({ id: Date.now(), message });

      return { ok: true };
    },
    [reports, session, persistAndBroadcast]
  );

  const stats = useMemo(() => {
    const total = reports.length;
    const pendientes = reports.filter((r) => r.status === 'pendiente').length;
    const enRevision = reports.filter((r) => r.status === 'en_revision').length;
    const resueltos = reports.filter((r) => r.status === 'resuelto').length;
    return { total, pendientes, enRevision, resueltos };
  }, [reports]);

  return {
    reports,
    stats,
    realtimeNotice,
    dismissNotice: () => setRealtimeNotice(null),
    createReport,
    updateReportStatus,
    deleteReport,
  };
}
