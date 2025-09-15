
// FILE: /var/www/html/violent_monkey/aistudio/scripts/auto-actions.js
(function() {
	'use strict';
	
	console.log('🤖 Auto Actions loaded');
	
	// Auto-scroll to bottom of chat
	function autoScrollToBottom() {
		const chatContainer = document.querySelector('.chat-container, [data-testid="chat-messages"]');
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}
	
	// Keyboard shortcuts
	function setupKeyboardShortcuts() {
		document.addEventListener('keydown', (e) => {
			// Ctrl+Enter to send message
			if (e.ctrlKey && e.key === 'Enter') {
				const sendButton = document.querySelector('button[type="submit"], .send-button, [data-testid="send-button"]');
				if (sendButton) {
					sendButton.click();
				}
			}
			
			// Ctrl+K to focus search/input
			if (e.ctrlKey && e.key === 'k') {
				e.preventDefault();
				const input = document.querySelector('textarea, input[type="text"], .message-input');
				if (input) {
					input.focus();
				}
			}
		});
	}
	
	// Auto-save drafts (to localStorage alternative - using sessionStorage)
	function setupAutoSave() {
		const textareas = document.querySelectorAll('textarea');
		textareas.forEach(textarea => {
			textarea.addEventListener('input', () => {
				const key = `aistudio_draft_${Date.now()}`;
				// In a real implementation, you'd want a proper key strategy
				console.log('Draft saved (would save to local storage):', textarea.value.substring(0, 50));
			});
		});
	}
	
	setupKeyboardShortcuts();
	setupAutoSave();
	
	// Auto scroll every few seconds
	setInterval(autoScrollToBottom, 3000);
	
})();
