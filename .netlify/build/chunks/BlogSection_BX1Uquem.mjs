import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, r as renderComponent, a as renderTemplate, u as unescapeHTML } from './astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import { a as $$ImageMod, c as config, p as plainify, D as DynamicIcon, g as getEntry, m as markdownify } from './Base_TJRx_iKA.mjs';
import { format } from 'date-fns';
import { g as getSinglePage } from './contentParser_JaMFgX7f.mjs';

const sortByDate = (array) => {
  const sortedArray = array.sort(
    (a, b) => new Date(b.data.date && b.data.date).valueOf() - new Date(a.data.date && a.data.date).valueOf()
  );
  return sortedArray;
};

const dateFormat = (date, pattern = "dd MMM, yyyy") => {
  const dateObj = new Date(date);
  const output = format(dateObj, pattern);
  return output;
};

const $$Astro$1 = createAstro("https://street2fleet.com");
const $$BlogCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BlogCard;
  const { summary_length, blog_folder } = config.settings;
  const {
    cardLayout,
    content: { data, id, body }
  } = Astro2.props;
  const { title, image, date } = data;
  return renderTemplate`${maybeRenderHead()}<div class="bg-body"> ${image && renderTemplate`<div class="relative flex items-center justify-center"> ${renderComponent($$result, "ImageMod", $$ImageMod, { "class": `${cardLayout === "creative" ? "absolute h-[80%] w-[90%] md:h-[70%] md:w-[82%]" : "h-[300px]"} mb-6 rounded-3xl object-cover`, "src": image, "alt": title, "format": "webp" })} ${cardLayout === "creative" && renderTemplate`${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "mb-6 h-[300px] w-full rounded-3xl object-cover md:h-[400px]", "src": "/images/blog-card-bg.png", "alt": "pattern", "format": "webp" })}`} </div>`} ${date && renderTemplate`<div class="mb-4 flex items-center gap-x-2"> ${renderComponent($$result, "ImageMod", $$ImageMod, { "class": "w-5", "src": "/images/icons/svg/date.svg", "alt": "date icon" })} <p class="inline-block font-medium text-tertiary"> ${dateFormat(date, "iiii, MMM dd, yyyy")} </p> </div>`} ${title && renderTemplate`<h3 class="h5 mb-3"> <a${addAttribute(`/${blog_folder}/${id}/`, "href")}>${title}</a> </h3>`} ${body && renderTemplate`<p class="mb-6">${plainify(body?.slice(0, Number(summary_length)))}</p>`} <a class="btn btn-text"${addAttribute(`/${blog_folder}/${id}/`, "href")}>
Read More
<div class="icon-wrapper"> <span class="icon"> ${renderComponent($$result, "DynamicIcon", DynamicIcon, { "className": "w-4", "icon": "FaArrowRight" })} </span> <span class="icon" aria-hidden="true"> ${renderComponent($$result, "DynamicIcon", DynamicIcon, { "className": "w-4", "icon": "FaArrowRight" })} </span> </div> </a> </div>`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/components/BlogCard.astro", void 0);

const $$Astro = createAstro("https://street2fleet.com");
const $$BlogSection = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogSection;
  let { content, largeHeading, visiblePosts, posts, cardLayout } = Astro2.props;
  let { title, subtitle, description } = (await getEntry("blogSection", "blog")).data;
  if (content) {
    ({ title, subtitle, description } = content);
  }
  const BLOG_FOLDER = "blog";
  posts = posts ? posts : await getSinglePage(BLOG_FOLDER);
  let sortedPosts = sortByDate(posts);
  visiblePosts && (sortedPosts = sortedPosts.slice(0, visiblePosts));
  return renderTemplate`${renderTemplate`${maybeRenderHead()}<section class="section overflow-hidden"><div class="container"><div class="row"><div class="mx-auto text-center lg:col-10" data-aos="fade-up-sm">${subtitle && renderTemplate`<p class="mb-2 font-medium text-tertiary">${unescapeHTML(markdownify(subtitle))}</p>`}${title && (largeHeading ? renderTemplate`<h1 class="h2 md:h1 mb-6">${unescapeHTML(markdownify(title))}</h1>` : renderTemplate`<h2 class="mb-6">${unescapeHTML(markdownify(title))}</h2>`)}${description && renderTemplate`<p class="text-lg/[inherit]">${unescapeHTML(markdownify(description))}</p>`}</div><div class="col-12 pt-20" data-aos="fade-up-sm" data-aos-delay="200"><div class="row gx-4 gy-5 justify-center md:gx-5">${sortedPosts?.map((blog) => renderTemplate`<div${addAttribute(` ${cardLayout === "creative" ? "md:col-6" : "md:col-6 lg:col-4"}`, "class")}>${blog && renderTemplate`${renderComponent($$result, "BlogCard", $$BlogCard, { "cardLayout": cardLayout, "content": blog })}`}</div>`)}</div></div></div></div></section>`}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/partials/BlogSection.astro", void 0);

export { $$BlogSection as $, dateFormat as d, sortByDate as s };
