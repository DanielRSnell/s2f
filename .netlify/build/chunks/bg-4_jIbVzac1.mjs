const bg4 = new Proxy({"src":"/_astro/bg-4.BF58Il5y.svg","width":180,"height":180,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/changelog/bg-4.svg";
							}
							
							return target[name];
						}
					});

export { bg4 as default };
