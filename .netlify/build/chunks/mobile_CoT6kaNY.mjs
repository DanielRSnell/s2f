const mobile = new Proxy({"src":"/_astro/mobile.Duo5LZ_9.png","width":372,"height":664,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/s2f-assets/mobile.png";
							}
							
							return target[name];
						}
					});

export { mobile as default };
