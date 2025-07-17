import { c as createComponent, m as maybeRenderHead, r as renderComponent, b as addAttribute, u as unescapeHTML, a as renderTemplate } from '../chunks/astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { g as getEntry, m as markdownify, a as $$ImageMod, c as config, $ as $$Base } from '../chunks/Base_TJRx_iKA.mjs';
import { $ as $$CallToAction } from '../chunks/CallToAction_B0iuZHXs.mjs';
import { $ as $$Faq } from '../chunks/Faq_C8Bury4t.mjs';
export { renderers } from '../renderers.mjs';

const $$ContactHero = createComponent(async ($$result, $$props, $$slots) => {
  const { contact_form_action } = config.params;
  const { hero } = (await getEntry("contact", "-index")).data;
  return renderTemplate`${maybeRenderHead()}<section class="section"> <div class="container"> <div class="row"> <div class="lg:col-7 lg:pe-20 lg:pt-16" data-aos="fade-left-sm"> ${hero.subtitle && renderTemplate`<p class="mb-2 font-medium text-tertiary">${unescapeHTML(markdownify(hero.subtitle))}</p>`} ${hero.title && renderTemplate`<h2 class="md:h1 mb-6">${unescapeHTML(markdownify(hero.title))}</h2>`} ${hero.description && renderTemplate`<p class="text-lg/[inherit]">${unescapeHTML(markdownify(hero.description))}</p>`} ${hero.list && renderTemplate`<div class="mt-10 flex flex-col gap-10 sm:flex-row xl:mt-20"> ${hero.list.map((point) => renderTemplate`<div> ${point.icon && renderTemplate`<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-tertiary"> ${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "h-6 w-6 object-cover", "src": point.icon, "alt": `icon related to ${point.title}` })} </div>`} ${point.title && renderTemplate`<h3 class="h6 mb-2 mt-5">${unescapeHTML(markdownify(point.title))}</h3>`} ${point.description && renderTemplate`<p class="text-lg/[inherit]">${unescapeHTML(markdownify(point.description))}</p>`} </div>`)} </div>`} </div> <div class="relative pt-24 lg:col-5 lg:pt-16" data-aos="fade-left-sm" data-aos-delay="200"> ${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "absolute left-1/2 top-5 -z-10 w-20 -translate-x-1/2 lg:-top-7", "src": "/images/s2f-assets/long-icon.png", "alt": "Street2Fleet logo icon", "loading": "eager" })} <div class="rounded-2xl bg-light p-5 md:p-10"> <form class="row g-4"${addAttribute(contact_form_action, "action")} method="POST"> <div class="lg:col-6"> <label for="name" class="form-label">
First Name <span class="text-red-500">*</span> </label> <input id="name" name="name" class="form-input" placeholder="Your First Name" required type="text"> </div> <div class="lg:col-6"> <label for="name" class="form-label">
Last Name <span class="text-red-500">*</span> </label> <input id="name" name="name" class="form-input" placeholder="Your Last Name" required type="text"> </div> <div class="col-12"> <label for="email" class="form-label">
Email <span class="text-red-500">*</span> </label> <input id="email" name="email" class="form-input" placeholder="youremail@email.com" required type="email"> </div> <div class="col-12"> <label for="comapny-name" class="form-label">
Company Name <span class="text-red-500">*</span> </label> <input id="comapny-name" name="comapny-name" class="form-input" placeholder="Your Company Name" required type="text"> </div> <div class="col-12"> <label for="subject" class="form-label">
Subject <span class="text-red-500">*</span> </label> <input id="subject" name="subject" class="form-input" placeholder="Your Company Name" required type="text"> </div> <div class="col-12"> <label for="message" class="form-label">
Write Message <span class="text-red-500">*</span> </label> <textarea id="message" name="message" class="form-input" placeholder="Write Your Message Here" required rows="3">              </textarea> </div> <div class="col-12"> <button type="submit" class="btn btn-regular">
Send Message
</button> </div> </form> </div> </div> </div> </div> </section>`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/ContactHero.astro", void 0);

const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  const contact = await getEntry(
    "contact",
    "-index"
  );
  const { title, description, meta_title, image } = contact.data;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": title, "meta_title": meta_title, "description": description, "image": image }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "ContactHero", $$ContactHero, {})} ${renderComponent($$result2, "Faq", $$Faq, {})} ${renderComponent($$result2, "CallToAction", $$CallToAction, {})} ` })}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/pages/contact.astro", void 0);

const $$file = "/Users/broke/umbral/percision/themes/street2fleet/src/pages/contact.astro";
const $$url = "/contact/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
