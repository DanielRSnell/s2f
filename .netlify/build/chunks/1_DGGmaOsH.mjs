const _1 = new Proxy({"src":"/_astro/1.CD47dElq.jpg","width":800,"height":600,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/blog/1.jpg";
							}
							
							return target[name];
						}
					});

export { _1 as default };
