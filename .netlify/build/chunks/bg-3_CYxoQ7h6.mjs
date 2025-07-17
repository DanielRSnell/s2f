const bg3 = new Proxy({"src":"/_astro/bg-3.lCJ6joTD.svg","width":180,"height":180,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/changelog/bg-3.svg";
							}
							
							return target[name];
						}
					});

export { bg3 as default };
