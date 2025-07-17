import { c as createComponent, m as maybeRenderHead, r as renderComponent, u as unescapeHTML, b as addAttribute, a as renderTemplate } from './astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { g as getEntry, a as $$ImageMod, m as markdownify, D as DynamicIcon } from './Base_TJRx_iKA.mjs';

const $$CallToAction = createComponent(async ($$result, $$props, $$slots) => {
  const { enable, title, description, image, button } = (await getEntry(
    "ctaSection",
    "call-to-action"
  )).data;
  return renderTemplate`${enable && renderTemplate`${maybeRenderHead()}<section class="section mb-14"><div class="container"><div class="bg-text-dark px-10 py-16 xl:p-20 rounded-[40px] relative overflow-hidden"><div class="absolute !top-1/2 !-translate-y-1/2 !left-1/2 !-translate-x-1/2 rotate-[7.83deg] pointer-events-none" data-aos="fade-in" data-aos-delay="200">${renderComponent($$result, "ImageMod", $$ImageMod, { "class": " h-[641px] w-auto ", "src": image, "alt": "cta-image" })}</div><div class="row items-center justify-center"><div class="lg:col-8 text-center"><h2 class="text-text-light mb-4" data-aos="fade-up-sm">${unescapeHTML(markdownify(title))}</h2><p class="text-text-light text-lg/[inherit] mb-6" data-aos="fade-up-sm" data-aos-delay="50">${unescapeHTML(markdownify(description))}</p>${button.enable && renderTemplate`<a class="btn btn-primary-light"${addAttribute(button.link, "href")}${addAttribute(button.link.startsWith("http") ? "_blank" : "_self", "target")} rel="noopener" data-aos="fade-up-sm" data-aos-delay="200">${button.label}<span class="icon-wrapper"><span class="icon">${renderComponent($$result, "DynamicIcon", DynamicIcon, { "icon": "FaArrowRight" })}</span><span class="icon" aria-hidden="true">${renderComponent($$result, "DynamicIcon", DynamicIcon, { "icon": "FaArrowRight" })}</span></span></a>`}</div></div></div></div></section>`}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/CallToAction.astro", void 0);

export { $$CallToAction as $ };
