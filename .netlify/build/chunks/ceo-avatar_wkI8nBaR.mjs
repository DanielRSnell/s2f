const ceoAvatar = new Proxy({"src":"/_astro/ceo-avatar.kLAkJi80.png","width":136,"height":136,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/ceo-avatar.png";
							}
							
							return target[name];
						}
					});

export { ceoAvatar as default };
