(function () {
	let scrWidth = window.screen.width;

	const updateCSSVariables = () => {
		const root = document.documentElement;
		if (root && typeof window !== 'undefined') {
			root.style.setProperty('--app-height', window.innerHeight + 'px');
		}
	};

	updateCSSVariables();

	window.addEventListener('resize', function () {
		let scrWidth = window.innerWidth;

		if (scrWidth > 992) {
			updateCSSVariables();
		}
	});
})();
