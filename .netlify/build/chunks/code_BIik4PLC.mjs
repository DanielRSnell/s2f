const code = new Proxy({"src":"/_astro/code.DkaIcYyk.svg","width":25,"height":25,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/icons/svg/code.svg";
							}
							
							return target[name];
						}
					});

export { code as default };
