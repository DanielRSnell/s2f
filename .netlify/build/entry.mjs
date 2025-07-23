import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_5LAeGOvp.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/404.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/blog/page/_slug_.astro.mjs');
const _page3 = () => import('./pages/blog/_single_.astro.mjs');
const _page4 = () => import('./pages/blog.astro.mjs');
const _page5 = () => import('./pages/changelog.astro.mjs');
const _page6 = () => import('./pages/contact.astro.mjs');
const _page7 = () => import('./pages/features.astro.mjs');
const _page8 = () => import('./pages/integration.astro.mjs');
const _page9 = () => import('./pages/pricing.astro.mjs');
const _page10 = () => import('./pages/review.astro.mjs');
const _page11 = () => import('./pages/_regular_.astro.mjs');
const _page12 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["src/pages/404.astro", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/blog/page/[slug].astro", _page2],
    ["src/pages/blog/[single].astro", _page3],
    ["src/pages/blog/index.astro", _page4],
    ["src/pages/changelog.astro", _page5],
    ["src/pages/contact.astro", _page6],
    ["src/pages/features.astro", _page7],
    ["src/pages/integration.astro", _page8],
    ["src/pages/pricing.astro", _page9],
    ["src/pages/review.astro", _page10],
    ["src/pages/[regular].astro", _page11],
    ["src/pages/index.astro", _page12]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "df50338f-29f3-44f3-8585-3be9ec79921b"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
