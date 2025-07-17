const longIcon = new Proxy({"src":"/_astro/long-icon.BsE3wlz9.png","width":180,"height":369,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/s2f-assets/long-icon.png";
							}
							
							return target[name];
						}
					});

export { longIcon as default };
