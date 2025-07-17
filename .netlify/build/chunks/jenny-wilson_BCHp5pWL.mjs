const jennyWilson = new Proxy({"src":"/_astro/jenny-wilson.2H0Fc1V3.png","width":65,"height":64,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/author/jenny-wilson.png";
							}
							
							return target[name];
						}
					});

export { jennyWilson as default };
