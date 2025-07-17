const essentialFeature1 = new Proxy({"src":"/_astro/essential-feature-1.D49-Cszm.png","width":1044,"height":848,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/features/essential-feature-1.png";
							}
							
							return target[name];
						}
					});

export { essentialFeature1 as default };
