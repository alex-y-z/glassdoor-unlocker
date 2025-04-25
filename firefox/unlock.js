const OVERLAY_IDS = ['HardsellOverlay', 'ContentWallHardsell', 'ContentHardsell'];

const unlockPage = () => {
	document.body.style.overflow = '';
	document.body.style.position = '';
	window.onscroll = () => {};
}

const unlockReview = (review) => {
	const showMore = review.querySelector('button[class^="expand-button"]');
	if (!showMore) {
		return; // All content is visible
	}

	const reviewText = review.querySelectorAll('p[class^="review-text_isCollapsed"]');
	const showButton = showMore.cloneNode(true);
	const hideClass = reviewText[0].className;
	
	for (const text of reviewText) {
		text.parentNode.style.pointerEvents = 'none'; // Disable redirect
	}
	
	showButton.setAttribute('data-hidden', 'true');
	showMore.parentNode.appendChild(showButton);
	showMore.remove();
	
	showButton.addEventListener('click', () => {
		if (showButton.getAttribute('data-hidden') === 'true') {
			showButton.childNodes[0].nodeValue = 'Show less';
			showButton.querySelector('svg').setAttribute('transform', 'scale(1, -1)');
			showButton.setAttribute('data-hidden', 'false');
			for (const text of reviewText) {
				text.classList.remove(hideClass);
			}
		}
		else {
			showButton.childNodes[0].nodeValue = 'Show more';
			showButton.querySelector('svg').setAttribute('transform', '');
			showButton.setAttribute('data-hidden', 'true');
			for (const text of reviewText) {
				text.classList.add(hideClass);
			}
		}
	});
}

const unlockInsights = (overview) => {
	const showMore = overview.parentNode.querySelector('div[class^="review-overview_buttonContainer"] > button');
	const showButton = showMore.cloneNode(true);
	const hideClass = overview.classList[1];
	
	showMore.parentNode.appendChild(showButton);
	showMore.remove();
	
	showButton.addEventListener('click', () => {
		if (overview.classList.contains(hideClass)) {
			showButton.childNodes[0].nodeValue = 'Show less insights';
			showButton.querySelector('svg').setAttribute('transform', 'scale(1, -1)');
			overview.classList.remove(hideClass);
		}
		else {
			showButton.childNodes[0].nodeValue = 'Show more insights';
			showButton.querySelector('svg').setAttribute('transform', '');
			overview.classList.add(hideClass);
		}
	});
}


// Observe page changes to remove overlays and unlock navigation
for (const id of OVERLAY_IDS) {
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


// Observe main container to unlock insights and reviews
const content = document.querySelector('main');

if (content) {
	const overview = content.querySelectorAll('div[class^="review-overview_ratingsContainer"]').forEach(unlockInsights);
	if (overview) {
		unlockInsights(overview);
	}

	content.querySelectorAll('div[id^="empReview"]').forEach(unlockReview);

	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node.className && node.className.includes('review-overview_hidden')) {
					unlockInsights(node);
				}
				else if (node.className && node.className.includes('ReviewsList')) {
					node.querySelectorAll('div[id^="empReview"]').forEach(unlockReview);
					return; // Loaded together on initial page visit
				}
				else if (node.nodeName === 'LI') {
					const review = node.querySelector('div[id^="empReview"]');
					if (review) {
						unlockReview(review); // Loaded individually thereafter
					}
				}
			}
		}
	}).observe(content, { childList: true, subtree: true });
}