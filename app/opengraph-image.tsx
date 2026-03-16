import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#2C5F2E',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 50%, rgba(168,197,160,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(74,140,79,0.2) 0%, transparent 40%)',
          }}
        />

        {/* Logo leaf */}
        <div
          style={{
            width: 100,
            height: 100,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            fontSize: 56,
          }}
        >
          🌿
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-1px',
            marginBottom: 16,
          }}
        >
          Bali Greenhouse
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(168,197,160,0.9)',
            marginBottom: 48,
          }}
        >
          Solusi Berkebun Terlengkap di Bali
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: 'flex',
            gap: 60,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: '20px 48px',
          }}
        >
          {[
            { value: '500+', label: 'Jenis Produk' },
            { value: '1000+', label: 'Pelanggan Puas' },
            { value: '8+', label: 'Kategori' },
          ].map((s) => (
            <div
              key={s.label}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
            >
              <span style={{ fontSize: 36, fontWeight: 700, color: '#C8952A' }}>{s.value}</span>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
