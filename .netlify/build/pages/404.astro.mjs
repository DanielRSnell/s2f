import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { $ as $$Base, a as $$ImageMod, D as DynamicIcon } from '../chunks/Base_TJRx_iKA.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Page Not Found", "notFoundPage": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section text-center"> <div class="container" data-aos="fade-up-sm"> <div class="row justify-center"> <div class="sm:col-10 md:col-8 lg:col-7 text-center"> ${renderComponent($$result2, "ImageMod", $$ImageMod, { "class": "mx-auto mb-16 block w-[480px]", "src": "/images/404.svg", "alt": "404 image" })} <h1 class="h2 md:h1 mb-4">Oops! Page Not Found</h1> <div class="content"> <p>
Your Trusted Partner in Data Protection with Cutting-Edge
              Solutions for <br> Comprehensive Data Security.
</p> </div> <a href="/" class="btn btn-dark mt-8">
Back to home
<span class="icon-wrapper"> <span class="icon"> ${renderComponent($$result2, "DynamicIcon", DynamicIcon, { "icon": "FaArrowRight" })} </span> <span class="icon" aria-hidden="true"> ${renderComponent($$result2, "DynamicIcon", DynamicIcon, { "icon": "FaArrowRight" })} </span> </span> </a> </div> </div> </div> </section> ` })}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/pages/404.astro", void 0);

const $$file = "/Users/broke/umbral/percision/themes/street2fleet/src/pages/404.astro";
const $$url = "/404/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
