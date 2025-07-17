import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, u as unescapeHTML, a as renderTemplate, r as renderComponent } from '../chunks/astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { g as getEntry, m as markdownify, a as $$ImageMod, $ as $$Base } from '../chunks/Base_TJRx_iKA.mjs';
import { $ as $$CallToAction } from '../chunks/CallToAction_B0iuZHXs.mjs';
import { $ as $$FeaturesExplanation } from '../chunks/FeaturesExplanation_JSYvvgOs.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://street2fleet.com");
const $$ChangelogSection = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ChangelogSection;
  const changelogPage = Astro2.url.pathname.startsWith("/changelog");
  const { title, subtitle, description, list } = (await getEntry(
    "changelogSection",
    "changelog"
  )).data;
  return renderTemplate`${maybeRenderHead()}<section class="section"> <div class="container"> <div class="row"> <div${addAttribute(`${changelogPage ? "xl:col-8" : "xl:col-7"} mx-auto text-center lg:col-8`, "class")} data-aos="fade-up-sm"> ${subtitle && renderTemplate`<p class="mb-2 font-medium text-tertiary">${unescapeHTML(markdownify(subtitle))}</p>`} ${title && !changelogPage && renderTemplate`<h2 class="mb-6">${unescapeHTML(markdownify(title))}</h2>`} ${title && changelogPage && renderTemplate`<h1 class="h2 md:h1 mb-6">${unescapeHTML(markdownify(title))}</h1>`} ${description && renderTemplate`<p class="text-lg/[inherit]">${unescapeHTML(markdownify(description))}</p>`} </div> <div class="col-12 mx-auto pt-20" data-aos="fade-up-sm" data-aos-delay="200"> ${list?.map((item) => renderTemplate`<div class="row gy-5 mb-10 items-start md:g-0 last:mb-0"> <div class="col-auto mx-auto md:sticky md:top-20"> <div${addAttribute(`relative flex w-52 flex-col justify-start rounded-3xl bg-text-dark px-6 py-5`, "class")}> ${item.short_title && renderTemplate`<div class="mb-2 text-base leading-relaxed text-white font-medium">${unescapeHTML(markdownify(item.short_title, true))}</div>`} ${item.date && renderTemplate`<p class="mb-24 text-base text-white/30">${unescapeHTML(markdownify(item.date))}</p>`} ${item.image && renderTemplate`${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "pointer-events-none absolute -bottom-8 -right-8 select-none", "src": item.image, "alt": `bg pattern` })}`} ${item.version && renderTemplate`<p class="rounded-full bg-secondary px-6 py-2 text-center text-lg/[inherit] font-medium">${unescapeHTML(markdownify(item.version))}</p>`} </div> </div> ${item.content && renderTemplate`<div class="md:col-8 lg:col-9"> <div class="content prose-p:text-lg/[inherit]">${unescapeHTML(markdownify(item.content, true))}</div> </div>`} </div>`)} </div> </div> </div> </section>`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/ChangelogSection.astro", void 0);

const $$Changelog = createComponent(async ($$result, $$props, $$slots) => {
  const feature = await getEntry(
    "features",
    "-index"
  );
  const { title, description, meta_title, image } = feature.data;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": title, "meta_title": meta_title, "description": description, "image": image }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "ChangelogSection", $$ChangelogSection, {})} ${renderComponent($$result2, "FeaturesExplanation", $$FeaturesExplanation, { "hideHeadingBar": true })} ${renderComponent($$result2, "CallToAction", $$CallToAction, {})} ` })}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/pages/changelog.astro", void 0);

const $$file = "/Users/broke/umbral/percision/themes/street2fleet/src/pages/changelog.astro";
const $$url = "/changelog/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Changelog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
