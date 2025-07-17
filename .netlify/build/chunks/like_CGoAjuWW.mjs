const like = new Proxy({"src":"/_astro/like.DS67TIi2.svg","width":24,"height":25,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/icons/svg/like.svg";
							}
							
							return target[name];
						}
					});

export { like as default };
