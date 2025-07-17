const banner2 = new Proxy({"src":"/_astro/banner-2.DlZwGraN.png","width":692,"height":197,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/banner-2.png";
							}
							
							return target[name];
						}
					});

export { banner2 as default };
