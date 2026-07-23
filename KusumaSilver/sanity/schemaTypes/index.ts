import { category } from './category';
import { product } from './product';
import { storeInfo } from './storeInfo';
import { homePage } from './homePage';
import { aboutPage } from './aboutPage';
import { contactPage } from './contactPage';
import { bespokePage } from './bespokePage';
import { cataloguePage } from './cataloguePage';
import { order } from './order';

// Shared building blocks, reused across documents rather than repeated.
import { localeString, localeText } from './objects/locale';
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

  // Shared objects
  localeString,
  localeText,
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
