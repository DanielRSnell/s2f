const essentialFeature2 = new Proxy({"src":"/_astro/essential-feature-2.1lwd0120.png","width":1017,"height":806,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/features/essential-feature-2.png";
							}
							
							return target[name];
						}
					});

export { essentialFeature2 as default };
