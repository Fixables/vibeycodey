'use client';

export const dynamic = 'force-dynamic';

import { NextStudio } from 'next-sanity/studio';
// The config lives at the project root because that is where the Sanity CLI
// looks for it (`sanity schema validate`, `sanity typegen`, `dataset export`).
import config from '@/sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
