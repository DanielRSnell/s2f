import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, r as renderComponent, u as unescapeHTML, a as renderTemplate } from '../../chunks/astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { r as renderEntry, h as humanize, m as markdownify, p as plainify, a as $$ImageMod, $ as $$Base } from '../../chunks/Base_TJRx_iKA.mjs';
import { g as getSinglePage } from '../../chunks/contentParser_JaMFgX7f.mjs';
import { d as dateFormat, $ as $$BlogSection } from '../../chunks/BlogSection_BX1Uquem.mjs';
import { $ as $$CallToAction } from '../../chunks/CallToAction_B0iuZHXs.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://street2fleet.com");
const $$BlogSingle = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BlogSingle;
  const { post } = Astro2.props;
  const { body } = post;
  const { Content } = await renderEntry(post);
  const { title, author, image, date } = post.data;
  const authorList = await getSinglePage("authors");
  const postAuthor = authorList && authorList.filter((a) => a.data.title, author)[0];
  return renderTemplate`${maybeRenderHead()}<section class="section"> <div class="container"> <div class="row justify-center"> <div class="text-center lg:col-9" data-aos="fade-up-sm"> ${title && renderTemplate`<h1 class="h2 mb-4">${unescapeHTML(markdownify(title))}</h1>`} ${body && renderTemplate`<p class="mb-6 text-lg">${plainify(body?.slice(0, 190))}</p>`} <ul class="mb-4 flex items-center justify-center gap-4"> <li class="text-lg/[inherit]"> <span class="flex gap-2 font-medium"> <img class="h-8 w-8"${addAttribute(postAuthor.data.image, "src")}${addAttribute(postAuthor.data.title, "alt")}> ${humanize(postAuthor.data.title)} </span> </li> <li class="flex items-center gap-x-2"> <img class="h-8 w-8" src="/images/icons/svg/date.svg" alt="date icon"> <p class="inline-block font-medium text-tertiary"> ${dateFormat(date, "iiii, MMM dd, yyyy")} </p> </li> </ul> </div> <div class="col-12 pt-20 md:pt-32" data-aos="fade-up-sm" data-aos-delay="200"> ${image && renderTemplate`<div class="mb-10"> ${renderComponent($$result, "ImageMod", $$ImageMod, { "src": image, "height": 500, "width": 1200, "alt": title, "class": "h-auto w-full rounded-3xl object-cover md:h-[700px]", "format": "webp" })} </div>`} </div> <article class="pb-10 lg:col-8" data-aos="fade-up-sm"> <div class="content"> ${renderComponent($$result, "Content", Content, {})} </div> </article> </div> </div> <!-- Related posts --> ${renderComponent($$result, "BlogSection", $$BlogSection, { "visiblePosts": 3 })} ${renderComponent($$result, "CallToAction", $$CallToAction, {})} </section>`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/BlogSingle.astro", void 0);

const $$Astro = createAstro("https://street2fleet.com");
async function getStaticPaths() {
  const BLOG_FOLDER = "blog";
  const posts = await getSinglePage(BLOG_FOLDER);
  const paths = posts.map((post) => ({
    params: {
      single: post.id
    },
    props: { post }
  }));
  return paths;
}
const $$single = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$single;
  const { post } = Astro2.props;
  const { title, meta_title, description, image } = post.data;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": title, "meta_title": meta_title, "description": description, "image": image }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "BlogSingle", $$BlogSingle, { "post": post })} ` })}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/pages/blog/[single].astro", void 0);

const $$file = "/Users/broke/umbral/percision/themes/street2fleet/src/pages/blog/[single].astro";
const $$url = "/blog/[single]/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$single,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
