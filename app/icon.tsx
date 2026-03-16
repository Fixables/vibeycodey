import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#2C5F2E',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
        }}
      >
        {/* Leaf shape */}
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <path
            d="M11 2C7.5 2 4 5 4.5 9.5C5 14 7.5 18 11 19C14.5 18 17 14 17.5 9.5C18 5 14.5 2 11 2Z"
            fill="white"
          />
          <path
            d="M11 19V15"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
