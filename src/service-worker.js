chrome.commands.onCommand.addListener((command) => {
	if (command === 'remove-blockers') {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {action: 'remove'});
		});
	}
});
