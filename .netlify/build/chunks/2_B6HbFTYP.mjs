const _2 = new Proxy({"src":"/_astro/2.H4V9fcpo.jpg","width":144,"height":144,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/avatar/2.jpg";
							}
							
							return target[name];
						}
					});

export { _2 as default };
