function getNumericStyle(elt, attr) {
	return parseFloat(window.getComputedStyle(elt)[attr]);
}

function getLowerCaseClass(elt) {
	return (elt.getAttribute('class') || '').toLowerCase();
}

async function getEltsToDelete() {
	const data = await chrome.storage.sync.get('zIndex');
	const minZIndex = parseInt(data.zIndex) || 5;
	console.log(minZIndex);	
	const classExclusionKeywords = ['header', 'footer', 'nav'];
	const excludedTags = ['header'];

	const elts = Array.from(document.querySelectorAll('body *')).filter(e => !Number.isNaN(getNumericStyle(e, 'zIndex')));

	return elts.filter(e => getNumericStyle(e, 'zIndex') >= minZIndex &&
						!excludedTags.includes(e.tagName.toLowerCase()) &&
						!classExclusionKeywords.some(c => getLowerCaseClass(e).includes(c)));
}

function getOverflowHiddenElts() {
	const elts = Array.from(document.querySelectorAll('*'));
	const classExclusionKeywords = ['header', 'footer', 'promo', 'nav'];
	const overflowTags = ['html', 'body', 'div'];

	const hiddenOverflows = [];
	for (let i = 0; i < elts.length; ++i) { 
		const overflow = window.getComputedStyle(elts[i]).overflow;
		if (overflow.includes('hidden') &&
			!classExclusionKeywords.some(c => getLowerCaseClass(elts[i]).includes(c)) &&
		 	overflowTags.includes(elts[i].tagName.toLowerCase())) {
			hiddenOverflows.push(elts[i]);
		}
	}

	return hiddenOverflows
}

chrome.runtime.onMessage.addListener( async function(message, sender, sendResponse) {
	// Listener for the command to remove screen blockers
	if (message.action == 'remove') {
		const toDelete = await getEltsToDelete();
		toDelete.forEach(b => b.remove());

		const hiddenOverflows = getOverflowHiddenElts();
		hiddenOverflows.forEach(h => h.style.setProperty('overflow-y', 'auto', 'important'));
	}
});
