import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, a as renderTemplate, b as addAttribute, r as renderComponent } from '../chunks/astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { g as getEntry, m as markdownify, a as $$ImageMod, $ as $$Base } from '../chunks/Base_TJRx_iKA.mjs';
import { $ as $$Clients } from '../chunks/Clients_CMLDfi7H.mjs';
import { $ as $$FeaturesGrid, a as $$FeatureSection } from '../chunks/FeaturesGrid_Nz7Uj_E0.mjs';
import { $ as $$FeaturesExplanation } from '../chunks/FeaturesExplanation_JSYvvgOs.mjs';
import { $ as $$PricingSection } from '../chunks/PricingSection_BVgdu6Em.mjs';
import { $ as $$Testimonial } from '../chunks/Testimonial_CWEaLzLH.mjs';
import { $ as $$CallToAction } from '../chunks/CallToAction_B0iuZHXs.mjs';
export { renderers } from '../renderers.mjs';

const $$HowItWorks = createComponent(async ($$result, $$props, $$slots) => {
  const { title, subtitle, description, list } = (await getEntry(
    "howItWorksSection",
    "how-it-works"
  )).data;
  return renderTemplate`${maybeRenderHead()}<section class="section"> <div class="container"> <div class="row"> <div class="mx-auto text-center lg:col-10" data-aos="fade-up-sm"> ${subtitle && renderTemplate`<p class="mb-2 text-tertiary font-medium">${unescapeHTML(markdownify(subtitle))}</p>`} ${title && renderTemplate`<h2 class="mb-6">${unescapeHTML(markdownify(title))}</h2>`} ${description && renderTemplate`<p class="text-lg/[inherit]">${unescapeHTML(markdownify(description))}</p>`} </div> <div class="col-12 pt-20"> <div class="row g-4 justify-center"> ${list?.map((item, index) => renderTemplate`<div class="md:col-6 lg:col-4" data-aos="fade-up-sm"${addAttribute(index * 100, "data-aos-delay")}> <div class="min-h-full rounded-xl bg-light px-6 py-12 text-center md:rounded-3xl"> ${item.icon && renderTemplate`<div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-tertiary"> ${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "h-6 w-6 object-cover", "src": item.icon, "alt": `icon related to ${item.title}` })} </div>`} ${item.title && renderTemplate`<h3 class="h5 mb-2">${unescapeHTML(markdownify(item.title))}</h3>`} ${item.description && renderTemplate`<p>${unescapeHTML(markdownify(item.description))}</p>`} </div> </div>`)} </div> </div> </div> </div> </section>`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/HowItWorks.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, {}, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Clients", $$Clients, {})} ${renderComponent($$result2, "HowItWorks", $$HowItWorks, {})} ${renderComponent($$result2, "FeaturesGrid", $$FeaturesGrid, {})} ${renderComponent($$result2, "Features", $$FeatureSection, {})} ${renderComponent($$result2, "FeaturesExplanation", $$FeaturesExplanation, {})} ${renderComponent($$result2, "PricingSection", $$PricingSection, {})} ${renderComponent($$result2, "Testimonial", $$Testimonial, { "visible_testimonial": 3 })} ${renderComponent($$result2, "CallToAction", $$CallToAction, {})} ` })}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/pages/index.astro", void 0);

const $$file = "/Users/broke/umbral/percision/themes/street2fleet/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
