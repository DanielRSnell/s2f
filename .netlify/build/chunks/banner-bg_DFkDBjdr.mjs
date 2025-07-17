const bannerBg = new Proxy({"src":"/_astro/banner-bg.BMMCF0Fg.png","width":2160,"height":1767,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/banner-bg.png";
							}
							
							return target[name];
						}
					});

export { bannerBg as default };
