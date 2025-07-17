import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { g as getEntry, $ as $$Base } from '../chunks/Base_TJRx_iKA.mjs';
import { $ as $$CallToAction } from '../chunks/CallToAction_B0iuZHXs.mjs';
import { $ as $$Clients } from '../chunks/Clients_CMLDfi7H.mjs';
import { $ as $$Faq } from '../chunks/Faq_C8Bury4t.mjs';
import { $ as $$PricingSection } from '../chunks/PricingSection_BVgdu6Em.mjs';
import { $ as $$Testimonial } from '../chunks/Testimonial_CWEaLzLH.mjs';
export { renderers } from '../renderers.mjs';

const $$Pricing = createComponent(async ($$result, $$props, $$slots) => {
  const pricing = await getEntry(
    "pricing",
    "-index"
  );
  const { title, description, meta_title, image, testimonial, hero } = pricing.data;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": title, "meta_title": meta_title, "description": description, "image": image }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PricingSection", $$PricingSection, { "largeHeading": true, "content": hero })} ${renderComponent($$result2, "Clients", $$Clients, {})} ${renderComponent($$result2, "Testimonial", $$Testimonial, { "content": testimonial, "visible_testimonial": 3 })} ${renderComponent($$result2, "Faq", $$Faq, {})} ${renderComponent($$result2, "CallToAction", $$CallToAction, {})} ` })}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/pages/pricing.astro", void 0);

const $$file = "/Users/broke/umbral/percision/themes/street2fleet/src/pages/pricing.astro";
const $$url = "/pricing/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Pricing,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
