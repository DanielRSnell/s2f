import { c as createComponent, e as renderScript, m as maybeRenderHead, b as addAttribute, u as unescapeHTML, a as renderTemplate } from './astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import 'clsx';
import { g as getEntry, m as markdownify } from './Base_TJRx_iKA.mjs';

const $$Faq = createComponent(async ($$result, $$props, $$slots) => {
  const { title, subtitle, description, list } = (await getEntry("faqSection", "faq")).data;
  return renderTemplate`${renderTemplate`${maybeRenderHead()}<section class="section"><div class="container"><div class="row"><div class="mx-auto text-center lg:col-10" data-aos="fade-up-sm">${subtitle && renderTemplate`<p class="mb-2 font-medium text-tertiary">${unescapeHTML(markdownify(subtitle))}</p>`}${title && renderTemplate`<h2 class="mb-6">${unescapeHTML(markdownify(title))}</h2>`}${description && renderTemplate`<p class="text-lg/[inherit]">${unescapeHTML(markdownify(description))}</p>`}</div><div class="col-12 pt-20" data-aos="fade-up-sm"${addAttribute(100, "data-aos-delay")}><div class="row g-4 justify-center">${list?.map((item, index) => renderTemplate`<div class="lg:col-10"><div${addAttribute(item.active ? "accordion active" : "accordion", "class")}>${item.title && renderTemplate`<button class="accordion-header" aria-label="toggle accordion content"><span class="text-base">${unescapeHTML(`${index + 1}.`)}</span><span>${unescapeHTML(item.title)}</span></button>`}${item.description && renderTemplate`<div class="accordion-content">${unescapeHTML(item.description)}</div>`}</div></div>`)}</div></div></div></div></section>`}${renderScript($$result, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/Faq.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/Faq.astro", void 0);

export { $$Faq as $ };
