const ogImage = new Proxy({"src":"/_astro/og-image.rQm2XZUu.png","width":1200,"height":900,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/og-image.png";
							}
							
							return target[name];
						}
					});

export { ogImage as default };
