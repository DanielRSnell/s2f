const blogCardBg = new Proxy({"src":"/_astro/blog-card-bg.B23lJODz.png","width":1176,"height":820,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/blog-card-bg.png";
							}
							
							return target[name];
						}
					});

export { blogCardBg as default };
