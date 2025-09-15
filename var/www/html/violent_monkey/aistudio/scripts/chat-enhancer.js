// FILE: /var/www/html/violent_monkey/aistudio/scripts/chat-enhancer.js
(function() {
	'use strict';
	
	console.log('🗨️ Chat Enhancer loaded');
	
	// Enhanced chat functionality
	function enhanceChat() {
		const chatContainer = document.querySelector('.chat-container, [data-testid="chat"]');
		if (!chatContainer) return;
		
		// Add copy buttons to messages
		const messages = chatContainer.querySelectorAll('.message, [data-testid="message"]');
		messages.forEach(message => {
			if (message.querySelector('.copy-btn')) return; // Already enhanced
			
			const copyBtn = document.createElement('button');
			copyBtn.className = 'copy-btn';
			copyBtn.textContent = '📋';
			copyBtn.style.cssText = 'margin-left: 10px; padding: 2px 6px; border: none; background: #f0f0f0; border-radius: 3px; cursor: pointer;';
			copyBtn.onclick = () => {
				navigator.clipboard.writeText(message.textContent);
				copyBtn.textContent = '✅';
				setTimeout(() => copyBtn.textContent = '📋', 1000);
			};
			
			message.appendChild(copyBtn);
		});
	}
	
	// Run enhancement periodically for new messages
	setInterval(enhanceChat, 2000);
	enhanceChat(); // Run immediately
	
})();


