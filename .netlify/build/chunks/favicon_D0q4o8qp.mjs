const favicon = new Proxy({"src":"/_astro/favicon.71qDDCUm.png","width":32,"height":32,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/favicon.png";
							}
							
							return target[name];
						}
					});

export { favicon as default };
