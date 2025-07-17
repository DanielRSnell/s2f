const truck = new Proxy({"src":"/_astro/truck.8zZHVXmg.svg","width":123,"height":120,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/s2f-assets/truck.svg";
							}
							
							return target[name];
						}
					});

export { truck as default };
