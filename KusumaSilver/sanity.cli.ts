import { defineCliConfig } from 'sanity/cli';
import * as dotenv from 'dotenv';

/**
 * Sanity CLI configuration.
 *
 * The project's credentials live in `.env.local` (Next.js's convention), which
 * the Sanity CLI does not read on its own — without this the CLI reports
 * "Invalid studio config format", because `projectId` comes back undefined.
 * Loading it here makes these work with no extra environment setup:
 *
 *   npx sanity schema validate     — check the schemas
 *   npx sanity typegen generate    — regenerate TypeScript types
 *   npx sanity dataset export production backup.tar.gz   — take a backup
 */
dotenv.config({ path: '.env.local' });

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  },
});
