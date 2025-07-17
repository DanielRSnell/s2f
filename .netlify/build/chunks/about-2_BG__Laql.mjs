const about2 = new Proxy({"src":"/_astro/about-2.BwuyOkk2.jpg","width":2048,"height":1536,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/about-2.jpg";
							}
							
							return target[name];
						}
					});

export { about2 as default };
