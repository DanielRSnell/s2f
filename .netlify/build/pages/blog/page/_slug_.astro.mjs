import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate } from '../../../chunks/astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { $ as $$Pagination } from '../../../chunks/Pagination_C0okFMsP.mjs';
import { g as getEntry, c as config, $ as $$Base } from '../../../chunks/Base_TJRx_iKA.mjs';
import { g as getSinglePage } from '../../../chunks/contentParser_JaMFgX7f.mjs';
import { s as sortByDate, $ as $$BlogSection } from '../../../chunks/BlogSection_BX1Uquem.mjs';
import { $ as $$CallToAction } from '../../../chunks/CallToAction_B0iuZHXs.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://street2fleet.com");
async function getStaticPaths() {
  const BLOG_FOLDER = "blog";
  const posts = await getSinglePage(BLOG_FOLDER);
  const totalPages = Math.ceil(posts.length / config.settings.pagination);
  const paths = [];
  for (let i = 1; i < totalPages; i++) {
    paths.push({
      params: {
        slug: (i + 1).toString()
      }
    });
  }
  return paths;
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const BLOG_FOLDER = "blog";
  const { slug } = Astro2.params;
  const posts = await getSinglePage(BLOG_FOLDER);
  const postIndex = await getEntry(
    BLOG_FOLDER,
    "-index"
  );
  const sortedPosts = sortByDate(posts);
  const totalPages = Math.ceil(posts.length / config.settings.pagination);
  const currentPage = slug && !isNaN(Number(slug)) ? Number(slug) : 1;
  const indexOfLastPost = currentPage * config.settings.pagination;
  const indexOfFirstPost = indexOfLastPost - config.settings.pagination;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": postIndex.data.title, "meta_title": postIndex.data.meta_title, "image": postIndex.data.image, "description": postIndex.data.description }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "BlogSection", $$BlogSection, { "visiblePosts": 3, "posts": currentPosts })} ${renderComponent($$result2, "Pagination", $$Pagination, { "section": BLOG_FOLDER, "currentPage": currentPage, "totalPages": totalPages })} ${renderComponent($$result2, "CallToAction", $$CallToAction, {})} ` })}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/pages/blog/page/[slug].astro", void 0);

const $$file = "/Users/broke/umbral/percision/themes/street2fleet/src/pages/blog/page/[slug].astro";
const $$url = "/blog/page/[slug]/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
