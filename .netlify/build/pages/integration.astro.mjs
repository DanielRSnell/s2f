import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, u as unescapeHTML, a as renderTemplate, r as renderComponent } from '../chunks/astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { g as getEntry, m as markdownify, D as DynamicIcon, a as $$ImageMod, $ as $$Base } from '../chunks/Base_TJRx_iKA.mjs';
import { $ as $$CallToAction } from '../chunks/CallToAction_B0iuZHXs.mjs';
import { $ as $$Faq } from '../chunks/Faq_C8Bury4t.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://street2fleet.com");
const $$IntegrationSection = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$IntegrationSection;
  const integrationPage = Astro2.url.pathname.startsWith("/integration");
  const { title, subtitle, description, list } = (await getEntry(
    "integrationSection",
    "integration"
  )).data;
  return renderTemplate`${maybeRenderHead()}<section class="section"> <div class="container"> <div class="row"> <div${addAttribute(`${integrationPage ? "xl:col-9" : "xl:col-7"} mx-auto text-center lg:col-8`, "class")} data-aos="fade-up-sm"> ${subtitle && renderTemplate`<p class="mb-2 text-tertiary font-medium">${unescapeHTML(markdownify(subtitle))}</p>`} ${title && !integrationPage && renderTemplate`<h2 class="mb-6">${unescapeHTML(markdownify(title))}</h2>`} ${title && integrationPage && renderTemplate`<h1 class="h2 md:h1 mb-6">${unescapeHTML(markdownify(title))}</h1>`} ${description && renderTemplate`<p class="text-lg/[inherit]">${unescapeHTML(markdownify(description))}</p>`} </div> <div class="col-12 pt-20" data-aos="fade-up-sm"${addAttribute(200, "data-aos-delay")}> <div class="row g-4 justify-center"> ${list?.map((item) => renderTemplate`<div class="md:col-6 lg:col-4"> <div class="group relative min-h-full rounded-xl bg-light px-6 py-12 transition duration-300 hover:-translate-y-1 md:rounded-3xl"> ${item.button && item.button.enable && renderTemplate`<a class="btn btn-icon absolute top-[8%] right-[8%] !w-14 border-primary/15"${addAttribute(item.button.link, "href")}${addAttribute(
    item.button.link.startsWith("http") ? "_blank" : "_self",
    "target"
  )}> ${markdownify(item.button.label)} <span class="icon-wrapper"> <span class="icon"> ${renderComponent($$result, "DynamicIcon", DynamicIcon, { "icon": "FaArrowRight" })} </span> <span class="icon" aria-hidden="true"> ${renderComponent($$result, "DynamicIcon", DynamicIcon, { "icon": "FaArrowRight" })} </span> </span> </a>`} ${item.image && renderTemplate`${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "mb-3 w-28", "src": item.image, "alt": `${item.name}` })}`} ${item.name && renderTemplate`<h3 class="h5 mb-2">${unescapeHTML(markdownify(item.name))}</h3>`} ${item.description && renderTemplate`<p>${unescapeHTML(markdownify(item.description))}</p>`} ${item.list && renderTemplate`<ul class="mt-4 flex flex-wrap gap-2"> ${item.list.map((listItem) => renderTemplate`<li class="rounded-md bg-text-dark/10 px-4 py-1">${unescapeHTML(markdownify(listItem))}</li>`)} </ul>`} </div> </div>`)} </div> </div> </div> </div> </section>`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/IntegrationSection.astro", void 0);

const $$Integration = createComponent(async ($$result, $$props, $$slots) => {
  const feature = await getEntry(
    "integration",
    "-index"
  );
  const { title, description, meta_title, image } = feature.data;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": title, "meta_title": meta_title, "description": description, "image": image }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "IntegrationSection", $$IntegrationSection, {})} ${renderComponent($$result2, "Faq", $$Faq, {})} ${renderComponent($$result2, "CallToAction", $$CallToAction, {})} ` })}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/pages/integration.astro", void 0);

const $$file = "/Users/broke/umbral/percision/themes/street2fleet/src/pages/integration.astro";
const $$url = "/integration/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Integration,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
