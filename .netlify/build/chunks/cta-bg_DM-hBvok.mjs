const ctaBg = new Proxy({"src":"/_astro/cta-bg.hKvruLb9.svg","width":360,"height":621,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/cta-bg.svg";
							}
							
							return target[name];
						}
					});

export { ctaBg as default };
