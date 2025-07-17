const banner3 = new Proxy({"src":"/_astro/banner-3.C09NP4Bg.png","width":689,"height":170,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/banner-3.png";
							}
							
							return target[name];
						}
					});

export { banner3 as default };
