const _2 = new Proxy({"src":"/_astro/2.Cf6cLNtJ.jpg","width":780,"height":600,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/blog/2.jpg";
							}
							
							return target[name];
						}
					});

export { _2 as default };
