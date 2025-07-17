import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { $ as $$Pagination } from '../chunks/Pagination_C0okFMsP.mjs';
import { g as getEntry, c as config, $ as $$Base } from '../chunks/Base_TJRx_iKA.mjs';
import { g as getSinglePage } from '../chunks/contentParser_JaMFgX7f.mjs';
import { $ as $$BlogSection } from '../chunks/BlogSection_BX1Uquem.mjs';
import { $ as $$CallToAction } from '../chunks/CallToAction_B0iuZHXs.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const BLOG_FOLDER = "blog";
  const postIndex = await getEntry(
    BLOG_FOLDER,
    "-index"
  );
  const headingContent = postIndex.data.hero;
  const posts = await getSinglePage(BLOG_FOLDER);
  const totalPages = Math.ceil(posts.length / config.settings.pagination);
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": postIndex.data.title, "meta_title": postIndex.data.meta_title, "image": postIndex.data.image, "description": postIndex.data.description }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "BlogSection", $$BlogSection, { "largeHeading": true, "content": headingContent, "visiblePosts": 2, "cardLayout": "creative" })} ${renderComponent($$result2, "BlogSection", $$BlogSection, { "visiblePosts": 3 })} ${renderComponent($$result2, "Pagination", $$Pagination, { "section": BLOG_FOLDER, "totalPages": totalPages })} ${renderComponent($$result2, "CallToAction", $$CallToAction, {})} ` })}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/pages/blog/index.astro", void 0);

const $$file = "/Users/broke/umbral/percision/themes/street2fleet/src/pages/blog/index.astro";
const $$url = "/blog/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
