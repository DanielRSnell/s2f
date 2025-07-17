import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, a as renderTemplate, r as renderComponent, b as addAttribute } from '../chunks/astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { g as getEntry, m as markdownify, a as $$ImageMod, $ as $$Base } from '../chunks/Base_TJRx_iKA.mjs';
import { $ as $$CallToAction } from '../chunks/CallToAction_B0iuZHXs.mjs';
import { $ as $$Clients } from '../chunks/Clients_CMLDfi7H.mjs';
import { $ as $$Faq } from '../chunks/Faq_C8Bury4t.mjs';
export { renderers } from '../renderers.mjs';

const $$AboutBanner = createComponent(async ($$result, $$props, $$slots) => {
  const { title, subtitle, description, left_image, right_image, quote } = (await getEntry(
    "aboutBannerSection",
    "about-banner"
  )).data;
  return renderTemplate`${maybeRenderHead()}<section class="section"> <div class="container"> <div class="row"> <div class="mx-auto text-center lg:col-8" data-aos="fade-up-sm"> ${subtitle && renderTemplate`<p class="mb-2 font-medium text-tertiary">${unescapeHTML(markdownify(subtitle))}</p>`} ${title && renderTemplate`<h2 class="mb-6">${unescapeHTML(markdownify(title))}</h2>`} ${description && renderTemplate`<p class="text-lg/[inherit]">${unescapeHTML(markdownify(description))}</p>`} </div> <div class="col-12 pt-20" data-aos="fade-up-sm" data-aos-delay="200"> <div class="row g-4 justify-center"> ${left_image && renderTemplate`<div class="max-lg:order-last lg:col-6"> ${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "h-[300px] min-h-full w-full rounded-lg object-cover md:h-[600px] md:rounded-3xl", "src": left_image, "alt": `image related to ${title}` })} </div>`} <div class="max-lg:order-first lg:col-6"> ${right_image && renderTemplate`${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "h-[300px] w-full rounded-lg object-cover object-top md:h-[340px] md:rounded-3xl", "src": right_image, "alt": `image related to ${title}` })}`} ${quote && renderTemplate`<div class="relative mt-10 rounded-lg bg-tertiary p-6 pt-10 text-text-light md:rounded-3xl md:pt-8"> <div class="mb-4 flex items-center gap-5"> ${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "h-16 w-16 object-cover", "src": quote.avatar, "alt": `avatar related to ${quote.name}` })} <div> <h3 class="h6 text-inherit">${unescapeHTML(markdownify(quote.name))}</h3> <p class="text-inherit">${unescapeHTML(markdownify(quote.designation))}</p> </div> </div> ${quote.content && renderTemplate`<p class="text-lg/[inherit] text-inherit">${unescapeHTML(markdownify(quote.content))}</p>`} ${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "pointer-events-none absolute left-1/2 top-6 h-[2px] w-[90%] -translate-x-1/2 object-cover", "src": "/images/quote-line.png", "alt": "quote" })} ${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "pointer-events-none absolute -bottom-4 -right-4 h-36 w-40 object-contain", "src": "/images/quote-bg-shape.png", "alt": "quote" })} </div>`} </div> </div> </div> </div> </div> </section>`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/AboutBanner.astro", void 0);

const $$OurTeam = createComponent(async ($$result, $$props, $$slots) => {
  const { title, subtitle, description, list } = (await getEntry(
    "ourTeamSection",
    "our-team"
  )).data;
  return renderTemplate`${maybeRenderHead()}<section class="section"> <div class="container"> <div class="row"> <div class="mx-auto text-center lg:col-10" data-aos="fade-up-sm"> ${subtitle && renderTemplate`<p class="mb-2 font-medium text-tertiary">${unescapeHTML(markdownify(subtitle))}</p>`} ${title && renderTemplate`<h2 class="mb-6">${unescapeHTML(markdownify(title))}</h2>`} ${description && renderTemplate`<p class="text-lg/[inherit]">${unescapeHTML(markdownify(description))}</p>`} </div> <div class="col-12 pt-20" data-aos="fade-up-sm" data-aos-delay="200"> <div class="row g-4 justify-center"> ${list?.map((item) => renderTemplate`<div class="col-6 lg:col-3"> ${item.image && renderTemplate`<div class="mb-6 overflow-hidden rounded-xl bg-light text-center md:rounded-3xl"> ${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "w-full", "src": item.image, "alt": `photo of ${item.name}` })} </div>`} ${item.name && renderTemplate`<h3 class="h6 mb-1.5">${unescapeHTML(markdownify(item.name))}</h3>`} ${item.company && renderTemplate`<p>${unescapeHTML(markdownify(item.company))}</p>`} </div>`)} </div> </div> </div> </div> </section>`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/OurTeam.astro", void 0);

const $$OurValues = createComponent(async ($$result, $$props, $$slots) => {
  const { title, subtitle, description, list, stats } = (await getEntry(
    "ourValuesSection",
    "our-values"
  )).data;
  return renderTemplate`${maybeRenderHead()}<section class="section"> <div class="container"> <div class="row"> <div class="mx-auto text-center lg:col-10" data-aos="fade-up-sm"> ${subtitle && renderTemplate`<p class="mb-2 text-tertiary font-medium">${unescapeHTML(markdownify(subtitle))}</p>`} ${title && renderTemplate`<h2 class="mb-6">${unescapeHTML(markdownify(title))}</h2>`} ${description && renderTemplate`<p class="text-lg/[inherit]">${unescapeHTML(markdownify(description))}</p>`} </div> <div class="col-12 pt-20"> <div class="row g-4 justify-center"> ${list?.map((item, index) => renderTemplate`<div class="md:col-6 lg:col-4" data-aos="fade-up-sm"${addAttribute(200 + index * 50, "data-aos-delay")}> <div class="min-h-full rounded-xl bg-light px-6 py-12 text-center md:rounded-3xl"> ${item.icon && renderTemplate`<div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-tertiary"> ${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "h-6 w-6 object-cover", "src": item.icon, "alt": `icon related to ${item.title}` })} </div>`} ${item.title && renderTemplate`<h3 class="h5 mb-2">${unescapeHTML(markdownify(item.title))}</h3>`} ${item.description && renderTemplate`<p>${unescapeHTML(markdownify(item.description))}</p>`} </div> </div>`)} </div> <div class="row g-4 justify-center pt-16"> ${stats?.map((item, index) => renderTemplate`<div class="md:col-4 lg:col-4" data-aos="fade-up-sm"${addAttribute((stats.length - index) * 100, "data-aos-delay")}> <div class="text-center"> ${item.label && renderTemplate`<p class="mb-3 lg:text-lg/[inherit]">${unescapeHTML(markdownify(item.label))}</p>`} ${item.value && renderTemplate`<h3 class="h2 lg:h1 mb-2">${unescapeHTML(markdownify(item.value))}</h3>`} </div> </div>`)} </div> </div> </div> </div> </section>`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/OurValues.astro", void 0);

const $$About = createComponent(async ($$result, $$props, $$slots) => {
  const about = await getEntry("about", "-index");
  const { title, description, meta_title, image } = about.data;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": title, "meta_title": meta_title, "description": description, "image": image }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "AboutBanner", $$AboutBanner, {})} ${renderComponent($$result2, "Clients", $$Clients, {})} ${renderComponent($$result2, "OurValues", $$OurValues, {})} ${renderComponent($$result2, "OurTeam", $$OurTeam, {})} ${renderComponent($$result2, "Faq", $$Faq, {})} ${renderComponent($$result2, "CallToAction", $$CallToAction, {})} ` })}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/pages/about.astro", void 0);

const $$file = "/Users/broke/umbral/percision/themes/street2fleet/src/pages/about.astro";
const $$url = "/about/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
