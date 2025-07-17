const detection = new Proxy({"src":"/_astro/detection.DPF3Yiew.svg","width":24,"height":24,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/icons/svg/detection.svg";
							}
							
							return target[name];
						}
					});

export { detection as default };
