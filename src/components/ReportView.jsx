import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Lightbulb,
  Wrench,
  Footprints,
  Trash2,
  MapPin,
  Camera,
  Check,
  AlertCircle,
  Sparkles,
  X,
  Building,
  Layers,
  FileText,
} from 'lucide-react';
import {
  INCIDENT_CATEGORIES,
  CAMPUS_ZONES,
  PRIORITY_LEVELS,
} from '../constants/incidents.js';

const CATEGORY_ICONS = {
  Lightbulb,
  Wrench,
  Footprints,
  Trash2,
};

const CATEGORY_PASTEL_THEME = {
  luminarias: {
    selectedBg: 'bg-[#fff5dd]',
    badgeBg: 'bg-[#fff5dd]',
    borderSelected: 'border-[#fff5dd]',
  },
  mobiliario_banos: {
    selectedBg: 'bg-[#edf7ff]',
    badgeBg: 'bg-[#edf7ff]',
    borderSelected: 'border-[#edf7ff]',
  },
  andenes_rampas: {
    selectedBg: 'bg-[#eae8ff]',
    badgeBg: 'bg-[#eae8ff]',
    borderSelected: 'border-[#eae8ff]',
  },
  basura_reciclaje: {
    selectedBg: 'bg-[#ccfff3]',
    badgeBg: 'bg-[#ccfff3]',
    borderSelected: 'border-[#ccfff3]',
  },
};

const PRIORITY_SEGMENT_THEME = {
  baja: {
    activeClass: 'bg-[#edf7ff] text-[#000000] matter-bevel font-semibold',
    dotClass: 'bg-[#313233]',
  },
  media: {
    activeClass: 'bg-[#fff5dd] text-[#000000] matter-bevel font-semibold',
    dotClass: 'bg-[#313233]',
  },
  alta: {
    activeClass: 'bg-[#ffe5e5] text-[#000000] border border-[#ffc9c9] matter-bevel font-semibold',
    dotClass: 'bg-[#c60000]',
  },
};

export default function ReportView({ onBack, onSubmitReport, session }) {
  const photoInputRef = useRef(null);

  const [categoryId, setCategoryId] = useState(INCIDENT_CATEGORIES[0].id);
  const [zone, setZone] = useState(CAMPUS_ZONES[0]);
  const [specificLocation, setSpecificLocation] = useState('');
  const [priority, setPriority] = useState('media');
  const [description, setDescription] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [formError, setFormError] = useState('');

  const selectedPriority =
    PRIORITY_LEVELS.find((p) => p.id === priority) || PRIORITY_LEVELS[1];

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

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!specificLocation.trim() || specificLocation.trim().length < 3) {
      setFormError('Indica el punto específico dentro del bloque (ej. Piso 3, Baño sur, Salón 304).');
      return;
    }

    if (!description.trim() || description.trim().length < 8) {
      setFormError('Describe el problema con un poco más de detalle (mínimo 8 caracteres).');
      return;
    }

    const result = onSubmitReport({
      categoryId,
      zone,
      specificLocation,
      priority,
      description,
      photoDataUrl,
    });

    if (result?.ok) {
      onBack();
    } else if (result?.error) {
      setFormError(result.error);
    }
  };

  const descriptionLength = description.trim().length;

  return (
    <div className="w-full max-w-[740px] mx-auto px-3 sm:px-6 py-4 sm:py-7 z-10 animate-fadeIn">
      {/* Barra de navegación superior */}
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
        <button
          type="button"
          onClick={onBack}
          className="btn-matter-dark inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-[13px] sm:text-[14px] font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#ffc9c9]" strokeWidth={2} />
          <span className="sm:hidden">Volver</span>
          <span className="hidden sm:inline">Volver al Inicio</span>
        </button>

        <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-[300px] bg-[#ffe5e5] text-[#000000] border border-[#ffc9c9] matter-bevel px-3 sm:px-3.5 py-1 text-[11px] sm:text-[12px] font-semibold select-none">
          <Sparkles className="w-3.5 h-3.5 text-[#c60000]" strokeWidth={2} />
          <span>Reporte Oficial</span>
          <span className="hidden sm:inline">UniPiloto</span>
        </div>
      </div>

      {/* Encabezado limpio editorial */}
      <header className="px-1 pb-4 sm:pb-5">
        <div className="inline-flex items-center gap-2 rounded-[300px] bg-[#141416] border border-white/10 px-3 py-0.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c60000] animate-pulse" />
          <span className="micro-label text-[#e5e5e5]">Incidencia en Tiempo Real</span>
        </div>

        <h1 className="page-title font-semibold text-[#fafafa]">
          Nuevo Reporte de Campus
        </h1>

        <p className="text-[13px] sm:text-[14px] text-[#a1a1a1] mt-1 leading-[1.5]">
          Completa los tres pasos para notificar al equipo de infraestructura de la Universidad Piloto.
        </p>
      </header>

      {/* Formulario Modular en 3 Etapas Claramente Diferenciadas */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* ============================================================
            ETAPA 01 · CATEGORÍA DE LA INCIDENCIA (Compacta y por filas)
            Identidad visual: Carmesí Institucional (#c60000 / #ffc9c9)
           ============================================================ */}
        <fieldset className="stage-card min-w-0 w-full p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c60000] via-[#ffc9c9]/80 to-transparent" />

          <legend className="sr-only">Paso 1: Categoría de la Incidencia</legend>

          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center justify-center rounded-[8px] bg-[#c60000] text-[#ffffff] px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase shrink-0">
                01
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <Layers className="w-4 h-4 text-[#ffc9c9] shrink-0 hidden sm:block" strokeWidth={2} />
                <h2 className="text-[14px] sm:text-[16px] font-semibold text-[#fafafa] truncate">
                  Categoría de la Incidencia
                </h2>
              </div>
            </div>
            <span className="text-[11px] text-[#a1a1a1] shrink-0">Elige una opción</span>
          </div>

          {/* Lista compacta por filas (una sola columna limpia y ligera) */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {INCIDENT_CATEGORIES.map((category) => {
              const IconComponent = CATEGORY_ICONS[category.iconName] || Lightbulb;
              const isSelected = categoryId === category.id;
              const theme = CATEGORY_PASTEL_THEME[category.id] || CATEGORY_PASTEL_THEME.luminarias;

              return (
                <label
                  key={category.id}
                  title={category.label}
                  className={`choice-row group flex items-center gap-3 rounded-[12px] sm:rounded-[14px] px-3 py-2 sm:px-3.5 sm:py-2.5 border cursor-pointer ${
                    isSelected
                      ? `${theme.selectedBg} text-[#000000] ${theme.borderSelected} matter-bevel`
                      : 'bg-[#101012] hover:bg-[#17171a] text-[#fafafa] border-white/[0.07] hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="incident-category"
                    value={category.id}
                    checked={isSelected}
                    onChange={() => setCategoryId(category.id)}
                    aria-label={category.label}
                    className="sr-only"
                  />

                  <span
                    className={`w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 transition-colors matter-bevel ${
                      isSelected
                        ? 'bg-[#c60000] text-[#ffffff]'
                        : `${theme.badgeBg} text-[#000000]`
                    }`}
                  >
                    <IconComponent className="w-4 h-4" strokeWidth={2} />
                  </span>

                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-[13px] sm:text-[14px] font-semibold leading-tight ${
                        isSelected ? 'text-[#000000]' : 'text-[#fafafa]'
                      }`}
                    >
                      {category.shortLabel}
                    </div>
                    <p
                      className={`text-[11px] sm:text-[12px] leading-snug truncate mt-0.5 ${
                        isSelected ? 'text-[#313233]' : 'text-[#a1a1a1]'
                      }`}
                    >
                      {category.description}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'border-[#c60000] bg-[#c60000] text-[#ffffff]'
                        : 'border-white/20 group-hover:border-white/40'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* ============================================================
            ETAPA 02 · UBICACIÓN Y PRIORIDAD
            Identidad visual: Azul y Ámbar Pastel (#edf7ff / #fff5dd)
           ============================================================ */}
        <fieldset className="stage-card min-w-0 w-full p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#edf7ff] via-[#fff5dd]/85 to-transparent" />

          <legend className="sr-only">Paso 2: Ubicación y Prioridad</legend>

          <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center justify-center rounded-[8px] bg-[#edf7ff] text-[#000000] px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase shrink-0">
                02
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-[#edf7ff] shrink-0 hidden sm:block" strokeWidth={2} />
                <h2 className="text-[14px] sm:text-[16px] font-semibold text-[#fafafa] truncate">
                  Ubicación y Prioridad
                </h2>
              </div>
            </div>
            <span className="text-[11px] text-[#a1a1a1] shrink-0 hidden sm:inline">
              Sector del campus y urgencia
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="field-group space-y-1.5">
                <label
                  htmlFor="zone-select"
                  className="field-label text-[12px] sm:text-[13px] font-medium text-[#e5e5e5] flex items-center gap-1.5 transition-colors"
                >
                  <Building className="w-3.5 h-3.5 text-[#edf7ff]" strokeWidth={2} />
                  <span>Bloque o Sector Principal</span>
                </label>
                <select
                  id="zone-select"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="matter-input branded-select rounded-[12px] sm:rounded-[14px] w-full px-3.5 py-2.5 sm:py-3 text-[14px] sm:text-[15px] cursor-pointer"
                >
                  {CAMPUS_ZONES.map((z) => (
                    <option key={z} value={z} className="bg-[#171717] text-[#fafafa]">
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group space-y-1.5">
                <label
                  htmlFor="specific-location"
                  className="field-label text-[12px] sm:text-[13px] font-medium text-[#e5e5e5] flex items-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#ffc9c9]" strokeWidth={2} />
                  <span>Punto Específico (Piso / Salón)</span>
                </label>
                <input
                  id="specific-location"
                  type="text"
                  required
                  minLength={3}
                  value={specificLocation}
                  onChange={(e) => {
                    setSpecificLocation(e.target.value);
                    setFormError('');
                  }}
                  onBlur={syncAriaInvalid}
                  onInput={syncAriaInvalid}
                  enterKeyHint="next"
                  placeholder="Ej. Piso 3, frente al salón 304"
                  className="dimension-input matter-input rounded-[12px] sm:rounded-[14px] w-full px-3.5 py-2.5 sm:py-3 text-[14px] sm:text-[15px] placeholder-[#737373]"
                />
              </div>
            </div>

            {/* Selector segmentado elegante para Nivel de Prioridad */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] sm:text-[13px] font-medium text-[#e5e5e5]">
                  Nivel de Prioridad
                </span>
                <span className="hidden sm:inline text-[11px] text-[#a1a1a1]">
                  {selectedPriority.hint}
                </span>
              </div>

              <div
                role="radiogroup"
                aria-label="Nivel de Prioridad"
                className="grid grid-cols-3 gap-1.5 p-1 rounded-[13px] bg-[#0a0a0c] border border-white/[0.08]"
              >
                {PRIORITY_LEVELS.map((level) => {
                  const active = priority === level.id;
                  const segTheme = PRIORITY_SEGMENT_THEME[level.id] || PRIORITY_SEGMENT_THEME.media;

                  return (
                    <label
                      key={level.id}
                      className={`choice-row rounded-[9px] px-2 sm:px-3 py-2 text-center cursor-pointer flex items-center justify-center gap-1.5 text-[12px] sm:text-[13px] transition-all ${
                        active
                          ? segTheme.activeClass
                          : 'text-[#a1a1a1] hover:text-[#fafafa] hover:bg-white/[0.04]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="incident-priority"
                        value={level.id}
                        checked={active}
                        onChange={() => setPriority(level.id)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          active ? segTheme.dotClass : 'bg-white/25'
                        }`}
                      />
                      <span className="truncate">
                        <span className="sm:hidden">
                          {level.id === 'alta' ? 'Urgente' : level.label}
                        </span>
                        <span className="hidden sm:inline">{level.label}</span>
                      </span>
                    </label>
                  );
                })}
              </div>

              <p className="sm:hidden text-[11.5px] text-[#a1a1a1] px-0.5 leading-snug">
                {selectedPriority.hint}
              </p>
            </div>
          </div>
        </fieldset>

        {/* ============================================================
            ETAPA 03 · DESCRIPCIÓN Y FOTOGRAFÍA
            Identidad visual: Lavanda y Menta Pastel (#eae8ff / #ccfff3)
           ============================================================ */}
        <fieldset className="stage-card min-w-0 w-full p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#eae8ff] via-[#ccfff3]/85 to-transparent" />

          <legend className="sr-only">Paso 3: Descripción y Fotografía</legend>

          <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center justify-center rounded-[8px] bg-[#eae8ff] text-[#000000] px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase shrink-0">
                03
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-[#eae8ff] shrink-0 hidden sm:block" strokeWidth={2} />
                <h2 className="text-[14px] sm:text-[16px] font-semibold text-[#fafafa] truncate">
                  Descripción y Fotografía
                </h2>
              </div>
            </div>
            <span className="text-[11px] text-[#a1a1a1] shrink-0">
              {descriptionLength >= 8 ? (
                <span className="text-[#ccfff3] font-medium">Detalle listo</span>
              ) : (
                'Mín. 8 caracteres'
              )}
            </span>
          </div>

          <div className="space-y-4">
            <div className="field-group space-y-1.5">
              <label
                htmlFor="incident-description"
                className="field-label block text-[12px] sm:text-[13px] font-medium text-[#e5e5e5] transition-colors"
              >
                ¿Qué sucede exactamente?
              </label>
              <textarea
                id="incident-description"
                rows={3}
                required
                minLength={8}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setFormError('');
                }}
                onBlur={syncAriaInvalid}
                onInput={syncAriaInvalid}
                placeholder="Ej. Luminaria del pasillo parpadeando continuamente, grifo con fuga de agua..."
                className="dimension-input matter-input auto-textarea rounded-[12px] sm:rounded-[14px] w-full p-3.5 text-[14px] sm:text-[15px] placeholder-[#737373] leading-[1.5]"
              />
            </div>

            <div className="space-y-1.5">
              <span className="block text-[12px] sm:text-[13px] font-medium text-[#e5e5e5]">
                Evidencia fotográfica{' '}
                <span className="text-[#737373] font-normal">(Opcional)</span>
              </span>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              {!photoDataUrl ? (
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full rounded-[13px] border border-dashed border-white/15 hover:border-[#ccfff3]/60 bg-[#101012] hover:bg-[#161618] px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-[10px] bg-[#eae8ff] text-[#000000] matter-bevel flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Camera className="w-4 h-4 text-[#c60000]" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-[#fafafa] truncate">
                        Adjuntar o tomar fotografía
                      </p>
                      <p className="text-[11px] text-[#a1a1a1] truncate">
                        Ayuda a ubicar y resolver el daño más rápido
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex rounded-[300px] bg-white/[0.06] border border-white/10 px-2.5 py-0.5 text-[11px] text-[#e5e5e5] shrink-0">
                    Subir imagen
                  </span>
                </button>
              ) : (
                <div className="rounded-[13px] overflow-hidden border border-[#ccfff3]/55 bg-[#101012] p-2.5 sm:p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={photoDataUrl}
                      alt="Evidencia fotográfica"
                      className="w-12 h-12 rounded-[9px] object-cover border border-white/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1 rounded-[300px] bg-[#ccfff3] text-[#000000] px-2.5 py-0.5 text-[11px] font-semibold">
                        <Check className="w-3 h-3" strokeWidth={2.5} />
                        Fotografía lista
                      </span>
                      <p className="text-[11px] text-[#a1a1a1] mt-0.5 truncate">
                        Se enviará con tu reporte en tiempo real
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoDataUrl(null)}
                    aria-label="Quitar fotografía"
                    className="inline-flex items-center gap-1 rounded-[300px] bg-[#ffe5e5] text-[#c60000] hover:bg-[#ffc9c9] px-3 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Quitar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {formError && (
          <div
            role="alert"
            className="flex items-start sm:items-center gap-2.5 rounded-[14px] bg-[#ffe5e5] text-[#000000] border border-[#ffc9c9] matter-bevel px-4 py-3 text-[12px] sm:text-[13px] font-medium animate-fadeIn"
          >
            <AlertCircle className="w-4 h-4 text-[#c60000] shrink-0 mt-0.5 sm:mt-0" strokeWidth={2.25} />
            <span>{formError}</span>
          </div>
        )}

        {/* Barra de Envío Inferior Elegante */}
        <div className="pt-1 pb-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] sm:text-[12px] text-[#a1a1a1] text-center sm:text-left max-w-full truncate">
            Reportando como:{' '}
            <strong className="text-[#fafafa] font-medium">{session?.email}</strong>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onBack}
              className="btn-matter-dark flex-1 sm:flex-initial px-5 py-2.5 sm:py-3 text-[13px] sm:text-[14px] font-medium cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-unipiloto-red flex-[2] sm:flex-initial px-6 sm:px-7 py-2.5 sm:py-3 text-[14px] sm:text-[15px] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
              <span>Enviar Reporte</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
