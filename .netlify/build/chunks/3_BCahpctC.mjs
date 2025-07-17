const _3 = new Proxy({"src":"/_astro/3.C2fuHRNx.jpg","width":900,"height":600,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/blog/3.jpg";
							}
							
							return target[name];
						}
					});

export { _3 as default };
