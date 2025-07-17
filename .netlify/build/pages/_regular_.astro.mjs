import { d as createAstro, c as createComponent, m as maybeRenderHead, a as renderTemplate, r as renderComponent, b as addAttribute } from '../chunks/astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { h as humanize, r as renderEntry, $ as $$Base } from '../chunks/Base_TJRx_iKA.mjs';
import { g as getSinglePage } from '../chunks/contentParser_JaMFgX7f.mjs';
import { $ as $$CallToAction } from '../chunks/CallToAction_B0iuZHXs.mjs';
import 'clsx';
import dayjs from 'dayjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://street2fleet.com");
const $$PageHeader = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PageHeader;
  const { title = "", lastModified } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section> <div class="container text-center" data-aos="fade-up-sm"> <div class="rounded-2xl px-8 pt-20"> <h1 class="h2 md:h1 mb-4">${humanize(title)}</h1> <p class="text-2xl font-medium text-tertiary">Updated: ${lastModified}</p> </div> </div> </section>`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/PageHeader.astro", void 0);

const $$Astro = createAstro("https://street2fleet.com");
async function getStaticPaths() {
  const COLLECTION_FOLDER = "pages";
  const pages = await getSinglePage(COLLECTION_FOLDER);
  const paths = pages.map((page) => ({
    params: {
      regular: page.id
    },
    props: { page }
  }));
  return paths;
}
const $$regular = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$regular;
  const { page } = Astro2.props;
  const { title, meta_title, description, image } = page.data;
  const { Content, remarkPluginFrontmatter } = await renderEntry(page);
  const lastModified = dayjs(remarkPluginFrontmatter.lastModified).format(
    "MMMM DD, YYYY"
  );
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": title, "meta_title": meta_title, "description": description, "image": image }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHeader", $$PageHeader, { "title": title, "lastModified": lastModified })} ${maybeRenderHead()}<section class="section"> <div class="container" data-aos="fade-up-sm"${addAttribute(200, "data-aos-delay")}> <div class="row justify-center"> <div class="lg:col-10"> <div class="content"> ${renderComponent($$result2, "Content", Content, {})} </div> </div> </div> </div> </section> ${renderComponent($$result2, "CallToAction", $$CallToAction, {})} ` })}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/pages/[regular].astro", void 0);

const $$file = "/Users/broke/umbral/percision/themes/street2fleet/src/pages/[regular].astro";
const $$url = "/[regular]/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$regular,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
