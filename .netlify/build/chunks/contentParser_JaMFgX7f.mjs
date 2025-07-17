import { c as createComponent, a as renderTemplate } from './astro/server_CtSX6tUJ.mjs';
import 'kleur/colors';
import 'clsx';
import { b as getCollection } from './Base_TJRx_iKA.mjs';

const getSinglePage = async (collectionName) => {
  const allPages = await getCollection(collectionName);
  const removeIndex = allPages.filter((data) => data.id.match(/^(?!-)/));
  const removeDrafts = removeIndex.filter((data) => {
    const pageData = data.data;
    return pageData.draft !== true;
  });
  return removeDrafts;
};
createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "/Users/broke/umbral/percision/themes/street2fleet/src/lib/contentParser.astro", void 0);

export { getSinglePage as g };
