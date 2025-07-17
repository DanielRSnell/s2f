const truckModal = new Proxy({"src":"/_astro/truck-modal.kl9mqBMH.svg","width":123,"height":120,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/broke/umbral/percision/themes/street2fleet/public/images/s2f-assets/truck-modal.svg";
							}
							
							return target[name];
						}
					});

export { truckModal as default };
