const quoteBgShape = new Proxy({"src":"/_astro/quote-bg-shape.Bf2sVKQ-.png","width":260,"height":288,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/quote-bg-shape.png";
							}
							
							return target[name];
						}
					});

export { quoteBgShape as default };
