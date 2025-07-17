import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { g as getEntry, $ as $$Base } from '../chunks/Base_TJRx_iKA.mjs';
import { $ as $$CallToAction } from '../chunks/CallToAction_B0iuZHXs.mjs';
import { $ as $$FeaturesGrid, a as $$FeatureSection } from '../chunks/FeaturesGrid_Nz7Uj_E0.mjs';
export { renderers } from '../renderers.mjs';

const $$Features = createComponent(async ($$result, $$props, $$slots) => {
  const features = await getEntry(
    "features",
    "-index"
  );
  const { title, description, meta_title, image, hero } = features.data;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": title, "meta_title": meta_title, "description": description, "image": image }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "FeaturesGrid", $$FeaturesGrid, { "content": hero, "largeHeading": true })} ${renderComponent($$result2, "FeaturesSection", $$FeatureSection, {})} ${renderComponent($$result2, "CallToAction", $$CallToAction, {})} ` })}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/pages/features.astro", void 0);

const $$file = "/Users/broke/umbral/percision/themes/street2fleet/src/pages/features.astro";
const $$url = "/features/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Features,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
