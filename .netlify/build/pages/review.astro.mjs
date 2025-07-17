import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { g as getEntry, $ as $$Base } from '../chunks/Base_TJRx_iKA.mjs';
import { $ as $$CallToAction } from '../chunks/CallToAction_B0iuZHXs.mjs';
import { $ as $$Testimonial } from '../chunks/Testimonial_CWEaLzLH.mjs';
export { renderers } from '../renderers.mjs';

const $$Review = createComponent(async ($$result, $$props, $$slots) => {
  const review = await getEntry(
    "review",
    "-index"
  );
  const { title, description, meta_title, image, testimonial } = review.data;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": title, "meta_title": meta_title, "description": description, "image": image }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Testimonial", $$Testimonial, { "largeHeading": true, "content": testimonial })} ${renderComponent($$result2, "CallToAction", $$CallToAction, {})} ` })}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/pages/review.astro", void 0);

const $$file = "/Users/broke/umbral/percision/themes/street2fleet/src/pages/review.astro";
const $$url = "/review/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Review,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
