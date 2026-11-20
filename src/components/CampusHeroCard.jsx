import React from 'react';

const CAMPUS_PHOTO = '/foto-unipiloto.jpg';

export default function CampusHeroCard() {
  return (
    <section
      aria-label="Fotografía del campus Universidad Piloto de Colombia"
      className="w-full relative group"
    >
      {/* Resplandor ambiental sutil detrás de la fotografía */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1.5 rounded-[32px] opacity-35 sm:opacity-45 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
        style={{
          background:
            'linear-gradient(125deg, rgba(198, 0, 0, 0.34) 0%, rgba(237, 247, 255, 0.09) 50%, rgba(147, 0, 0, 0.28) 100%)',
        }}
      />

      {/* BOCETO 2: Fotografía oficial de la Universidad completamente limpia en marco de galería */}
      <div className="relative rounded-[20px] sm:rounded-[26px] p-1.5 sm:p-2 bg-gradient-to-b from-[#252528] via-[#171719] to-[#0f0f10] border border-white/[0.11] shadow-[0_26px_58px_-16px_rgba(0,0,0,0.88)]">
        {/* Proporción reservada (aspect-ratio) para evitar saltos de diseño al cargar */}
        <div className="relative w-full aspect-[16/10] sm:aspect-auto sm:h-[420px] rounded-[15px] sm:rounded-[20px] bg-[#0a0a0a] overflow-hidden">
          <img
            src={CAMPUS_PHOTO}
            alt="Campus Universidad Piloto de Colombia"
            width="1024"
            height="405"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[15px] sm:rounded-[20px] ring-1 ring-inset ring-white/15"
          />
        </div>
      </div>
    </section>
  );
}
