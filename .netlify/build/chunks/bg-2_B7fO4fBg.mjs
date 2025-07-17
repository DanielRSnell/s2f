const bg2 = new Proxy({"src":"/_astro/bg-2.EBc9y_YD.svg","width":180,"height":180,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/changelog/bg-2.svg";
							}
							
							return target[name];
						}
					});

export { bg2 as default };
