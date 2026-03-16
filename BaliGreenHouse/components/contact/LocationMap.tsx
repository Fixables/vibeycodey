'use client';

import { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

const LOCATIONS = [
  {
    id: 'utama',
    label: 'Lokasi Utama',
    address: 'Panjer, Denpasar, Bali',
    mapsUrl: 'https://maps.app.goo.gl/ZJ2Zx2MVAXad5TGW7',
  },
  {
    id: 'cabang',
    label: 'Lokasi Cabang',
    address: 'Gunung Agung, Denpasar, Bali',
    mapsUrl: 'https://maps.app.goo.gl/LpotWmp9AhjTViFu8',
  },
];

export function LocationMap() {
  const [active, setActive] = useState(0);
  const loc = LOCATIONS[active];

  return (
    <div className="overflow-hidden rounded-3xl border border-[#A8C5A0]/30 shadow-sm bg-white">
      {/* Toggle tabs */}
      <div className="flex border-b border-[#A8C5A0]/30">
        {LOCATIONS.map((l, i) => (
          <button
            key={l.id}
            onClick={() => setActive(i)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              active === i
                ? 'bg-[#2C5F2E] text-white'
                : 'text-[#6B7280] hover:bg-[#A8C5A0]/20 hover:text-[#2C5F2E]'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Map placeholder with open-in-maps CTA */}
      <div className="aspect-video bg-gradient-to-br from-[#A8C5A0]/20 to-[#2C5F2E]/10 flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-16 h-16 bg-[#2C5F2E]/10 rounded-full flex items-center justify-center">
          <MapPin className="w-8 h-8 text-[#2C5F2E]" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-[#2A2A2A] text-base">{loc.label}</p>
          <p className="text-[#6B7280] text-sm mt-0.5">{loc.address}</p>
        </div>
        <a
          href={loc.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#2C5F2E] hover:bg-[#4A8C4F] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Buka di Google Maps
        </a>
      </div>
    </div>
  );
}
