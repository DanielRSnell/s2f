const logo = new Proxy({"src":"/_astro/logo.K2OIZQC9.svg","width":134,"height":47,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/logo.svg";
							}
							
							return target[name];
						}
					});

export { logo as default };
