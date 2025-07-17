import { d as createAstro, c as createComponent, m as maybeRenderHead, u as unescapeHTML, a as renderTemplate, b as addAttribute, r as renderComponent } from './astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { g as getEntry, m as markdownify, a as $$ImageMod } from './Base_TJRx_iKA.mjs';

const $$Astro = createAstro("https://street2fleet.com");
const $$FeaturesExplanation = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FeaturesExplanation;
  const { hideHeadingBar } = Astro2.props;
  const { title, image, subtitle, description, list } = (await getEntry(
    "featuresExplanationSection",
    "features-explanation"
  )).data;
  return renderTemplate`${maybeRenderHead()}<section class="section"> <div class="container"> <div class="row"> ${!hideHeadingBar && renderTemplate`<div class="mx-auto text-center lg:col-10 xl:col-7" data-aos="fade-up-sm"> ${subtitle && renderTemplate`<p class="mb-2 font-medium text-tertiary">${unescapeHTML(markdownify(subtitle))}</p>`} ${title && renderTemplate`<h2 class="mb-6">${unescapeHTML(markdownify(title))}</h2>`} ${description && renderTemplate`<p class="text-lg/[inherit]">${unescapeHTML(markdownify(description))}</p>`} </div>`} <div class="col-12 pt-20"> <div class="relative flex justify-center gap-3 max-xl:flex-wrap xl:mb-12 xl:mt-16 xl:flex-col xl:items-center xl:gap-y-8">  ${list?.map((item, mindex) => renderTemplate`<div${addAttribute(`order-2 flex gap-x-3 xl:order-0 max-xl:justify-center xl:items-center ${mindex < 1 ? "flex-col max-xl:gap-y-3 md:w-[60%] xl:w-auto xl:flex-row" : "flex-col gap-y-3 sm:flex-row"}`, "class")}>  ${item.row.map((item2, index) => renderTemplate`<div${addAttribute(`${(index + 1) % 2 === 0 ? "xl:order-3" : "xl:order-1"} xl:max-w-[370px]`, "class")}> <div class="mb-12 min-h-full rounded-xl bg-light px-6 py-12 text-center last:mb-0 md:rounded-3xl" data-aos="fade-up-sm"${addAttribute(index * 100, "data-aos-delay")}> ${item2.title && renderTemplate`<h3 class="h6 mb-2">${unescapeHTML(markdownify(item2.title))}</h3>`} ${item2.description && renderTemplate`<p>${unescapeHTML(markdownify(item2.description))}</p>`} </div> </div>`)}  <div class="xl:order-2 max-xl:hidden"> ${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "w-full", "src": "/images/features/line.png", "alt": "line svg" })} </div> </div>`)}  ${image && renderTemplate`<div class="order-1 w-[40%] xl:order-0 sm:w-[30%]"> <img class="mx-auto xl:absolute xl:left-1/2 xl:top-1/2 xl:w-[35%] xl:-translate-x-1/2 xl:-translate-y-1/2 rounded-[32px] shadow-2xl"${addAttribute(image, "src")}${addAttribute(title, "alt")}> </div>`} </div> </div> </div> </div> </section>`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/FeaturesExplanation.astro", void 0);

export { $$FeaturesExplanation as $ };
