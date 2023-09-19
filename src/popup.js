function removeClick() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    chrome.tabs.sendMessage(tabs[0].id, {action: 'remove'});
	});
}

function toggleClick() {
	const toggleContent = document.getElementById('toggle-content');
	const visibility = toggleContent.style.visibility === 'visible' ? 'collapse' : 'visible'; 
	toggleContent.style.setProperty('visibility', visibility);

	const toggleSymbol = document.getElementById('toggle-symbol');
	toggleSymbol.textContent = visibility === 'visible' ? '\u25B2' : '\u25BC';
}

function handleSettingInputChange(setting, value) {
	console.log(`${setting} - ${value}`);
	chrome.storage.sync.set({ [setting]: value });
}

document.addEventListener('DOMContentLoaded', async function() {
	document.getElementById('remove-button').addEventListener('click', removeClick, false);
	document.getElementById('toggle').addEventListener('click', toggleClick, false);

	const zIndexInput =	 document.getElementById('z-index-setting');
	zIndexInput.addEventListener('change', (e) => handleSettingInputChange('zIndex', e.target.value));

	const data = await chrome.storage.sync.get('zIndex');
	zIndexInput.value = data.zIndex || 5;
}, false);