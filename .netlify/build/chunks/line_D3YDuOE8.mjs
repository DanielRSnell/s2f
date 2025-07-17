const line = new Proxy({"src":"/_astro/line.BBuCFFCt.png","width":1109,"height":4,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/features/line.png";
							}
							
							return target[name];
						}
					});

export { line as default };
