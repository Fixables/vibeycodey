import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { en } from '../../lib/translations/en';
import { id } from '../../lib/translations/id';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const aboutBody = {
  id: [
    'Kusuma Silver lahir dari kecintaan kami terhadap seni kerajinan perak Bali yang telah diwariskan turun-temurun. Setiap perhiasan yang kami buat adalah perwujudan dari keahlian tangan pengrajin Bali yang berpengalaman.',
    'Kami menggunakan perak 925 berkualitas tinggi yang telah tersertifikasi, dipadukan dengan desain yang menggabungkan estetika tradisional Bali dengan sentuhan kontemporer.',
    'Visi kami adalah membawa keindahan kerajinan perak Bali ke seluruh dunia, sambil terus mendukung para pengrajin lokal Bali.',
  ],
  en: [
    'Kusuma Silver was born from our love for Balinese silver craftsmanship that has been passed down through generations. Every piece of jewelry we create is an embodiment of the skill of experienced Balinese artisans.',
    'We use certified high-quality 925 silver, combined with designs that blend traditional Balinese aesthetics with contemporary touches.',
    'Our vision is to bring the beauty of Balinese silver craftsmanship to the world, while continuing to support local Balinese artisans.',
  ],
};

const aboutPage = {
  _id: 'aboutPage',
  _type: 'aboutPage',
  heroEyebrow: id.storyV3.eyebrow,
  heroEyebrowEn: en.storyV3.eyebrow,
  heroTitle: id.storyV3.title,
  heroTitleEn: en.storyV3.title,
  lede: id.storyV3.lede,
  ledeEn: en.storyV3.lede,
  body1: aboutBody.id[0],
  body1En: aboutBody.en[0],
  body2: aboutBody.id[1],
  body2En: aboutBody.en[1],
  body3: aboutBody.id[2],
  body3En: aboutBody.en[2],
  value1Head: id.storyV3.valuesHead1,
  value1HeadEn: en.storyV3.valuesHead1,
  value1Body: id.storyV3.valuesBody1,
  value1BodyEn: en.storyV3.valuesBody1,
  value2Head: id.storyV3.valuesHead2,
  value2HeadEn: en.storyV3.valuesHead2,
  value2Body: id.storyV3.valuesBody2,
  value2BodyEn: en.storyV3.valuesBody2,
  value3Head: id.storyV3.valuesHead3,
  value3HeadEn: en.storyV3.valuesHead3,
  value3Body: id.storyV3.valuesBody3,
  value3BodyEn: en.storyV3.valuesBody3,
  ctaTitle: id.storyV3.ctaTitle,
  ctaTitleEn: en.storyV3.ctaTitle,
};

const contactPage = {
  _id: 'contactPage',
  _type: 'contactPage',
  eyebrow: id.contactV3.eyebrow,
  eyebrowEn: en.contactV3.eyebrow,
  title: id.contactV3.title,
  titleEn: en.contactV3.title,
  subtitle: id.contactV3.subtitle,
  subtitleEn: en.contactV3.subtitle,
  formTitle: id.contactV3.formTitle,
  formTitleEn: en.contactV3.formTitle,
};

const bespokePage = {
  _id: 'bespokePage',
  _type: 'bespokePage',
  heroEyebrow: id.bespokeV3.eyebrow,
  heroEyebrowEn: en.bespokeV3.eyebrow,
  heroTitle1: id.bespokeV3.title1,
  heroTitle1En: en.bespokeV3.title1,
  heroTitle2: id.bespokeV3.title2,
  heroTitle2En: en.bespokeV3.title2,
  heroIntro: id.bespokeV3.intro,
  heroIntroEn: en.bespokeV3.intro,
  processEyebrow: id.bespokeV3.processEyebrow,
  processEyebrowEn: en.bespokeV3.processEyebrow,
  processTitle: id.bespokeV3.processTitle,
  processTitleEn: en.bespokeV3.processTitle,
  step1Title: id.customOrder.steps[0].title,
  step1TitleEn: en.customOrder.steps[0].title,
  step1Body: id.customOrder.steps[0].description,
  step1BodyEn: en.customOrder.steps[0].description,
  step2Title: id.customOrder.steps[1].title,
  step2TitleEn: en.customOrder.steps[1].title,
  step2Body: id.customOrder.steps[1].description,
  step2BodyEn: en.customOrder.steps[1].description,
  step3Title: id.customOrder.steps[2].title,
  step3TitleEn: en.customOrder.steps[2].title,
  step3Body: id.customOrder.steps[2].description,
  step3BodyEn: en.customOrder.steps[2].description,
  step4Title: id.customOrder.steps[3].title,
  step4TitleEn: en.customOrder.steps[3].title,
  step4Body: id.customOrder.steps[3].description,
  step4BodyEn: en.customOrder.steps[3].description,
  formEyebrow: id.bespokeV3.formEyebrow,
  formEyebrowEn: en.bespokeV3.formEyebrow,
  formTitle: id.bespokeV3.formTitle,
  formTitleEn: en.bespokeV3.formTitle,
  formSub: id.bespokeV3.formSub,
  formSubEn: en.bespokeV3.formSub,
};

async function run() {
  console.log('🌱 Filling About / Contact / Bespoke pages with current site copy...');
  await client.createOrReplace(aboutPage);
  await client.createOrReplace(contactPage);
  await client.createOrReplace(bespokePage);
  await Promise.all([
    client.delete('drafts.aboutPage').catch(() => {}),
    client.delete('drafts.contactPage').catch(() => {}),
    client.delete('drafts.bespokePage').catch(() => {}),
  ]);
  console.log('✅ Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
