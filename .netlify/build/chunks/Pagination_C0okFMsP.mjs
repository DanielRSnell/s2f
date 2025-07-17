import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, a as renderTemplate } from './astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro("https://street2fleet.com");
const $$Pagination = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Pagination;
  const { section, currentPage = 1, totalPages = 1 } = Astro2.props;
  const indexPageLink = currentPage === 2;
  const hasPrevPage = currentPage > 1;
  const hasNextPage = totalPages > currentPage;
  let pageList = [];
  for (let i = 1; i <= totalPages; i++) {
    pageList.push(i);
  }
  return renderTemplate`${totalPages > 1 && renderTemplate`${maybeRenderHead()}<nav class="!mt-10 flex items-center justify-center space-x-3" aria-label="Pagination">${hasPrevPage ? renderTemplate`<a${addAttribute(
    indexPageLink ? `${section ? "/" + section : "/"}/` : `${section ? "/" + section : ""}/page/${currentPage - 1}/`,
    "href"
  )} class="px-2 py-2 text-text-dark transition-colors duration-300 hover:bg-light rounded-md"><span class="sr-only">Previous</span><svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" height="30" width="30"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></a>` : renderTemplate`<span class="px-2 py-2 text-text-light transition-colors duration-300 rounded-md"><span class="sr-only">Previous</span><svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" height="30" width="30"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></span>`}${pageList.map(
    (pagination, i) => pagination === currentPage ? renderTemplate`<span aria-current="page" class="bg-primary px-4 py-2 text-white rounded-md">${pagination}</span>` : renderTemplate`<a${addAttribute(
      i === 0 ? `${section ? "/" + section : "/"}/` : `${section ? "/" + section : ""}/page/${pagination}/`,
      "href"
    )} aria-current="page" class="px-4 py-2 text-text-dark transition-colors duration-300 hover:bg-primary hover:text-white rounded-md">${pagination}</a>`
  )}${hasNextPage ? renderTemplate`<a${addAttribute(`${section ? "/" + section : ""}/page/${currentPage + 1}/`, "href")} class="px-2 py-2 text-text-dark transition-colors duration-300 hover:bg-light rounded-md"><span class="sr-only">Next</span><svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" height="30" width="30"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg></a>` : renderTemplate`<span class="px-2 py-2 text-text-light rounded-md"><span class="sr-only">Next</span><svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" height="30" width="30"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg></span>`}</nav>`}`;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/layouts/components/Pagination.astro", void 0);

export { $$Pagination as $ };
