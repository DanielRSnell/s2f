const Dark_Logo = new Proxy({"src":"/_astro/Dark Logo.BRG5TwKu.png","width":887,"height":121,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/s2f-assets/Dark Logo.png";
							}
							
							return target[name];
						}
					});

export { Dark_Logo as default };
