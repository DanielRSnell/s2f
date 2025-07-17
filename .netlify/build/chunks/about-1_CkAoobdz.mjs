const about1 = new Proxy({"src":"/_astro/about-1.FAWJ-RhH.jpg","width":2048,"height":1366,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/about-1.jpg";
							}
							
							return target[name];
						}
					});

export { about1 as default };
