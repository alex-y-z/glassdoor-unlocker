const OVERLAY_IDS = ['HardsellOverlay', 'ContentWallHardsell', 'ContentHardsell'];

const unlockPage = () => {
	document.body.style.overflow = '';
	document.body.style.position = '';
	window.onscroll = () => {};
}

for (id of OVERLAY_IDS) {
	const overlay = document.getElementById(id);
	if (overlay) {
		overlay.remove();
		unlockPage();
	}
}

new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
			const node = mutation.addedNodes.item(0);
			if (OVERLAY_IDS.includes(node.id)) {
				node.remove();
			}
		}
		else if (mutation.type === 'attributes' && document.body.style.overflow === 'hidden') {
			unlockPage();
			return;
		}
	}
}).observe(document.body, { childList: true, attributes: true, attributeFilter: ['style'] });