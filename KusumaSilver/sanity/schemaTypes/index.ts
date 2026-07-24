import { category } from './category';
import { product } from './product';
import { storeInfo } from './storeInfo';
import { homePage } from './homePage';
import { aboutPage } from './aboutPage';
import { contactPage } from './contactPage';
import { bespokePage } from './bespokePage';
import { cataloguePage } from './cataloguePage';
import { order } from './order';
import { gemstone, material, size } from './taxonomy';

// Shared building blocks, reused across documents rather than repeated.
import { localeString, localeText } from './objects/locale';
import { richText, localeRichText } from './objects/richText';
import { gemstoneVariant, sizeVariant } from './objects/variants';
import { seo } from './objects/seo';
import { navItem } from './objects/navItem';
import {
  cataloguePanel,
  formOption,
  heritageStat,
  processStep,
  storyValue,
} from './objects/lists';
import {
  catalogueStripSection,
  heritageBandSection,
  manifestoSection,
} from './objects/sections';

export const schemaTypes = [
  // Documents
  category,
  product,
  storeInfo,
  homePage,
  aboutPage,
  contactPage,
  bespokePage,
  cataloguePage,
  order,

  // Filter lists
  gemstone,
  material,
  size,

  // Shared objects
  localeString,
  localeText,
  richText,
  localeRichText,
  gemstoneVariant,
  sizeVariant,
  seo,
  navItem,
  cataloguePanel,
  formOption,
  heritageStat,
  processStep,
  storyValue,
  catalogueStripSection,
  heritageBandSection,
  manifestoSection,
];
