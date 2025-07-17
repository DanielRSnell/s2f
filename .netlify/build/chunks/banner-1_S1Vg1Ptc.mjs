const banner1 = new Proxy({"src":"/_astro/banner-1.BjleiB0Z.png","width":456,"height":146,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/banner-1.png";
							}
							
							return target[name];
						}
					});

export { banner1 as default };
