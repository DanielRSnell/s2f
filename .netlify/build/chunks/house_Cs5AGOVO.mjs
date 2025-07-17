const house = new Proxy({"src":"/_astro/house.CzaIPuk-.svg","width":126,"height":107,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/s2f-assets/house.svg";
							}
							
							return target[name];
						}
					});

export { house as default };
