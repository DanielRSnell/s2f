const arrow = new Proxy({"src":"/_astro/arrow.3MQd0YLM.svg","width":16,"height":16,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/icons/svg/arrow.svg";
							}
							
							return target[name];
						}
					});

export { arrow as default };
