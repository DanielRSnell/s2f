const product = new Proxy({"src":"/_astro/product.hWnmBxOB.png","width":907,"height":1856,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/features/product.png";
							}
							
							return target[name];
						}
					});

export { product as default };
