const bannerMain = new Proxy({"src":"/_astro/banner-main.CevFNcrE.png","width":1551,"height":779,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/banner-main.png";
							}
							
							return target[name];
						}
					});

export { bannerMain as default };
