const date = new Proxy({"src":"/_astro/date.yQnYVIzI.png","width":25,"height":25,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/icons/png/date.png";
							}
							
							return target[name];
						}
					});

export { date as default };
