const log = new Proxy({"src":"/_astro/log.CmPoAMHR.png","width":49,"height":49,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/icons/png/log.png";
							}
							
							return target[name];
						}
					});

export { log as default };
