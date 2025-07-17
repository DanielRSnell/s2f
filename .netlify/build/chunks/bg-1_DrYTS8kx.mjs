const bg1 = new Proxy({"src":"/_astro/bg-1.CwZo2i3Y.svg","width":178,"height":178,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/changelog/bg-1.svg";
							}
							
							return target[name];
						}
					});

export { bg1 as default };
