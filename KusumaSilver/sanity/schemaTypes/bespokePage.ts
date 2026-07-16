import { defineField, defineType } from 'sanity';

/**
 * Bespoke / Custom Order (Custom) page content. Blank fields fall back to the
 * built-in default copy. Each text field is bilingual: (ID) / (EN).
 */
export const bespokePage = defineType({
  name: 'bespokePage',
  title: 'Bespoke Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Top of page', default: true },
    { name: 'process', title: 'The four steps' },
    { name: 'form', title: 'Enquiry form' },
  ],
  fields: [
    defineField({ name: 'heroEyebrow', title: 'Top — small label (ID)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroEyebrowEn', title: 'Top — small label (EN)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle1', title: 'Top — heading, first line (ID)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle1En', title: 'Top — heading, first line (EN)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle2', title: 'Top — heading, second line / italic (ID)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle2En', title: 'Top — heading, second line / italic (EN)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroIntro', title: 'Top — intro paragraph (ID)', type: 'text', rows: 3, group: 'hero' }),
    defineField({ name: 'heroIntroEn', title: 'Top — intro paragraph (EN)', type: 'text', rows: 3, group: 'hero' }),
    defineField({ name: 'heroImage', title: 'Top — photo (right side)', type: 'image', options: { hotspot: true }, group: 'hero' }),

    defineField({ name: 'processEyebrow', title: 'Steps — small label (ID)', type: 'string', group: 'process' }),
    defineField({ name: 'processEyebrowEn', title: 'Steps — small label (EN)', type: 'string', group: 'process' }),
    defineField({ name: 'processTitle', title: 'Steps — heading (ID)', type: 'string', group: 'process' }),
    defineField({ name: 'processTitleEn', title: 'Steps — heading (EN)', type: 'string', group: 'process' }),
    defineField({ name: 'step1Title', title: 'Step 1 — title (ID)', type: 'string', group: 'process' }),
    defineField({ name: 'step1TitleEn', title: 'Step 1 — title (EN)', type: 'string', group: 'process' }),
    defineField({ name: 'step1Body', title: 'Step 1 — text (ID)', type: 'text', rows: 2, group: 'process' }),
    defineField({ name: 'step1BodyEn', title: 'Step 1 — text (EN)', type: 'text', rows: 2, group: 'process' }),
    defineField({ name: 'step2Title', title: 'Step 2 — title (ID)', type: 'string', group: 'process' }),
    defineField({ name: 'step2TitleEn', title: 'Step 2 — title (EN)', type: 'string', group: 'process' }),
    defineField({ name: 'step2Body', title: 'Step 2 — text (ID)', type: 'text', rows: 2, group: 'process' }),
    defineField({ name: 'step2BodyEn', title: 'Step 2 — text (EN)', type: 'text', rows: 2, group: 'process' }),
    defineField({ name: 'step3Title', title: 'Step 3 — title (ID)', type: 'string', group: 'process' }),
    defineField({ name: 'step3TitleEn', title: 'Step 3 — title (EN)', type: 'string', group: 'process' }),
    defineField({ name: 'step3Body', title: 'Step 3 — text (ID)', type: 'text', rows: 2, group: 'process' }),
    defineField({ name: 'step3BodyEn', title: 'Step 3 — text (EN)', type: 'text', rows: 2, group: 'process' }),
    defineField({ name: 'step4Title', title: 'Step 4 — title (ID)', type: 'string', group: 'process' }),
    defineField({ name: 'step4TitleEn', title: 'Step 4 — title (EN)', type: 'string', group: 'process' }),
    defineField({ name: 'step4Body', title: 'Step 4 — text (ID)', type: 'text', rows: 2, group: 'process' }),
    defineField({ name: 'step4BodyEn', title: 'Step 4 — text (EN)', type: 'text', rows: 2, group: 'process' }),

    defineField({ name: 'formEyebrow', title: 'Form — small label (ID)', type: 'string', group: 'form' }),
    defineField({ name: 'formEyebrowEn', title: 'Form — small label (EN)', type: 'string', group: 'form' }),
    defineField({ name: 'formTitle', title: 'Form — heading (ID)', type: 'string', group: 'form' }),
    defineField({ name: 'formTitleEn', title: 'Form — heading (EN)', type: 'string', group: 'form' }),
    defineField({ name: 'formSub', title: 'Form — subtitle (ID)', type: 'string', group: 'form' }),
    defineField({ name: 'formSubEn', title: 'Form — subtitle (EN)', type: 'string', group: 'form' }),
  ],
  preview: { prepare: () => ({ title: 'Bespoke Page', subtitle: 'Custom order page content' }) },
});
