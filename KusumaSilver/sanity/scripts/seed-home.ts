import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

/**
 * Pre-fills the Home Page singleton with the copy currently shown on the site,
 * so the owner can see exactly which field maps to which section. These are the
 * site's own existing defaults — nothing invented. Editing them in the Studio
 * (then Publish) updates the live home page.
 */
const homePage = {
  _id: 'homePage',
  _type: 'homePage',
  heroEyebrow: 'PERAK 925 · BALI UTARA',
  heroEyebrowEn: '925 STERLING · NORTH BALI',
  heroTitle1: 'Perak, ditempa dengan',
  heroTitle1En: 'Silver, forged the',
  heroTitle2: 'cara Bali Utara',
  heroTitle2En: 'North Balinese way',
  heroDesc:
    'Bengkel kerja di Singaraja. Setiap karya dicatat, diberi nomor, dan ditempa tangan — perak murni 925, tanpa lapisan.',
  heroDescEn:
    'A working atelier in Singaraja. Every piece catalogued, numbered, and forged by hand — 925 sterling silver, nothing plated.',
  heroCta1: 'LIHAT KATALOG',
  heroCta1En: 'ENTER THE CATALOGUE',
  heroCta2: 'CERITA KAMI',
  heroCta2En: 'OUR STORY',
  heritageEyebrow: 'WARISAN',
  heritageEyebrowEn: 'HERITAGE',
  heritageTitle: 'Ditempa di atas pesisir Lovina',
  heritageTitleEn: 'Forged above the Lovina coastline',
  heritageBody:
    'Jauh dari bengkel wisata di selatan, bengkel keluarga kami di Singaraja menjaga teknik lama Bali Utara tetap hidup — filigri gambar tangan, granulasi, dan tempa api terbuka.',
  heritageBodyEn:
    'Away from the tourist workshops of the south, our family atelier in Singaraja keeps the old North Balinese techniques alive — hand-drawn filigree, granulation, and open-flame forging.',
  statSilver: 'PERAK MURNI',
  statSilverEn: 'STERLING SILVER',
  statGen: 'GENERASI',
  statGenEn: 'GENERATIONS',
  statHand: 'TEMPA TANGAN',
  statHandEn: 'HAND-FORGED',
  manifestoQuote:
    '“Kami tidak membuat perhiasan untuk semusim. Kami menempanya untuk generasi.”',
  manifestoQuoteEn:
    '“We don’t make jewelry for a season. We forge it for generations.”',
  manifestoAttr: '— KELUARGA KUSUMA, SINGARAJA',
  manifestoAttrEn: '— THE KUSUMA FAMILY, SINGARAJA',
};

async function run() {
  console.log('🌱 Filling Home Page content with the current site copy...');
  await client.createOrReplace(homePage);
  // Remove any empty draft so the Studio shows the published values.
  await client.delete('drafts.homePage').catch(() => {});
  console.log('✅ Done. Reload the Studio → Home Page.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
