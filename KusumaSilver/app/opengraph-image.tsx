import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kusuma Silver — Perhiasan Perak 925 Asli dari Bali';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1E1A16',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, #3D352D 0%, #1E1A16 70%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Logo box */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: '#3D352D',
              border: '2px solid #B8922A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
            }}
          >
            💎
          </div>

          {/* Brand name */}
          <div style={{ fontSize: 64, fontWeight: 700, color: '#F8F4EE', letterSpacing: -1 }}>
            Kusuma Silver
          </div>

          {/* Gold divider */}
          <div style={{ width: 80, height: 3, background: '#B8922A', borderRadius: 2 }} />

          {/* Tagline */}
          <div style={{ fontSize: 24, color: '#B8922A', letterSpacing: 2, textTransform: 'uppercase' }}>
            Perhiasan Perak 925 Asli dari Bali
          </div>

          {/* Sub */}
          <div style={{ fontSize: 18, color: 'rgba(248, 244, 238, 0.6)', marginTop: 8 }}>
            Authentic 925 Silver Jewelry • Handcrafted in Bali
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
