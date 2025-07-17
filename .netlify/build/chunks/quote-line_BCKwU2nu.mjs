const quoteLine = new Proxy({"src":"/_astro/quote-line.ClaAMmGB.png","width":912,"height":2,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/quote-line.png";
							}
							
							return target[name];
						}
					});

export { quoteLine as default };
