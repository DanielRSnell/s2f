const Icon = new Proxy({"src":"/_astro/Icon.DQh-suxt.png","width":146,"height":104,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/s2f-assets/Icon.png";
							}
							
							return target[name];
						}
					});

export { Icon as default };
