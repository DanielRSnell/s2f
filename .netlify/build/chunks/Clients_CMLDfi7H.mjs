import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, b as addAttribute, a as renderTemplate } from './astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import 'clsx';
import { g as getEntry, m as markdownify } from './Base_TJRx_iKA.mjs';

const $$Clients = createComponent(async ($$result, $$props, $$slots) => {
  const clients = await getEntry(
    "clientsSection",
    "clients"
  );
  const { title, list } = clients.data;
  return renderTemplate`${maybeRenderHead()}<section class="section"> <div class="container"> <div class="row"> <div class="col-12" data-aos="fade-up-sm"> <div class="text-center sm:flex"> <p class="w-full pb-3 text-center font-medium tracking-wide sm:whitespace-nowrap sm:pb-0 text-lg">${unescapeHTML(markdownify(title))}</p> </div> </div> <div class="col-12 pt-10" data-aos="fade-up-sm" data-aos-delay="200"> <div class="flex justify-center gap-x-12 gap-y-6 grayscale opacity-50 max-lg:flex-wrap"> ${list?.map((logo) => renderTemplate`<div class="flex aspect-[3.125_/_1] w-36 items-center"> <img${addAttribute(logo, "src")} alt="brand logo" height="120"> </div>`)} </div> </div> </div> </div> </section>`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/Clients.astro", void 0);

export { $$Clients as $ };
