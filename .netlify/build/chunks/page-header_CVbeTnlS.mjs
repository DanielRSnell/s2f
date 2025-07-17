const pageHeader = new Proxy({"src":"/_astro/page-header.I4UhuO0C.png","width":2160,"height":2015,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/page-header.png";
							}
							
							return target[name];
						}
					});

export { pageHeader as default };
