const logoIcon = new Proxy({"src":"/_astro/logo-icon.O0mnXinh.svg","width":88,"height":176,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/logo-icon.svg";
							}
							
							return target[name];
						}
					});

export { logoIcon as default };
