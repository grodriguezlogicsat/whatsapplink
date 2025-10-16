
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/whatsapplink/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 1108, hash: '196575929dd5895829c5580e2b99a73d444034d46589c55c037a7d4a2aef1b73', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 986, hash: 'f094319850b8626fe20251e2086e3eacebac4c1d36a5d4a508715c7b6a241b6d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-XG47E724.css': {size: 3523, hash: 'ew05WlQz9ME', text: () => import('./assets-chunks/styles-XG47E724_css.mjs').then(m => m.default)}
  },
};
