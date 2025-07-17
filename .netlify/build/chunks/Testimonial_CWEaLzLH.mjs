import { d as createAstro, c as createComponent, m as maybeRenderHead, u as unescapeHTML, a as renderTemplate, r as renderComponent } from './astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { g as getEntry, m as markdownify, D as DynamicIcon, a as $$ImageMod } from './Base_TJRx_iKA.mjs';

const $$Astro = createAstro("https://street2fleet.com");
const $$Testimonial = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Testimonial;
  const { content, visible_testimonial, largeHeading } = Astro2.props;
  const contentEntry = (await getEntry(
    "testimonialSection",
    "testimonial"
  )).data;
  let { title, subtitle, description, list } = contentEntry;
  if (content) {
    ({ title, subtitle, description } = content);
  }
  if (visible_testimonial) {
    list = list?.slice(0, visible_testimonial);
  }
  return renderTemplate`${maybeRenderHead()}<section class="section"> <div class="container"> <div class="row"> <div class="mx-auto text-center lg:col-8 xl:col-9" data-aos="fade-up-sm"> ${subtitle && renderTemplate`<p class="mb-2 font-medium text-tertiary">${unescapeHTML(markdownify(subtitle))}</p>`} ${title && (largeHeading ? renderTemplate`<h1 class="h2 md:h1 mb-6">${unescapeHTML(markdownify(title))}</h1>` : renderTemplate`<h2 class="mb-6">${unescapeHTML(markdownify(title))}</h2>`)} ${description && renderTemplate`<p class="text-lg/[inherit]">${unescapeHTML(markdownify(description))}</p>`} </div> <div class="col-12 pt-20" data-aos="fade-up-sm" data-aos-delay="200"> <div class="row g-4 justify-center"> ${list?.map((item) => renderTemplate`<div class="md:col-6 lg:col-4"> <div class="flex min-h-full flex-col justify-start gap-8 rounded-xl bg-light p-6 md:rounded-3xl"> <div class="flex justify-start gap-x-2"> ${renderComponent($$result, "DynamicIcon", DynamicIcon, { "icon": "FaStar", "className": "text-yellow-500 text-2xl" })} ${renderComponent($$result, "DynamicIcon", DynamicIcon, { "icon": "FaStar", "className": "text-yellow-500 text-2xl" })} ${renderComponent($$result, "DynamicIcon", DynamicIcon, { "icon": "FaStar", "className": "text-yellow-500 text-2xl" })} ${renderComponent($$result, "DynamicIcon", DynamicIcon, { "icon": "FaStar", "className": "text-yellow-500 text-2xl" })} ${renderComponent($$result, "DynamicIcon", DynamicIcon, { "icon": "FaStar", "className": "text-yellow-500 text-2xl" })} </div> ${item.content && renderTemplate`<div class="content prose-strong:text-xl">${unescapeHTML(markdownify(item.content, true))}</div>`} <div class="flex flex-col gap-4 sm:flex-row"> ${item.avatar && renderTemplate`<div class="flex h-16 w-16 items-center overflow-hidden rounded-full"> ${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "h-full w-full object-cover", "src": item.avatar, "alt": `avatar of the ${item.name}` })} </div>`} <div> ${item.name && renderTemplate`<strong class="mb-2 text-lg/[inherit] font-medium">${unescapeHTML(markdownify(item.name))}</strong>`} ${item.designation && renderTemplate`<p>${unescapeHTML(markdownify(item.designation))}</p>`} </div> </div> </div> </div>`)} </div> </div> </div> </div> </section>`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/Testimonial.astro", void 0);

export { $$Testimonial as $ };
