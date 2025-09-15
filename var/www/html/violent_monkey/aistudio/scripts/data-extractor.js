
// FILE: /var/www/html/violent_monkey/aistudio/scripts/data-extractor.js
(function() {
	'use strict';
	
	console.log('📊 Data Extractor loaded');
	
	// Extract conversation data
	function extractConversationData() {
		const messages = document.querySelectorAll('.message, [data-testid="message"]');
		const conversationData = Array.from(messages).map((msg, index) => ({
			index,
			timestamp: new Date().toISOString(),
																																			 content: msg.textContent.trim(),
																																			 type: msg.classList.contains('user-message') ? 'user' : 'assistant',
																																			 wordCount: msg.textContent.trim().split(/\s+/).length
		}));
		
		return {
			timestamp: new Date().toISOString(),
 messageCount: conversationData.length,
 messages: conversationData,
 url: window.location.href
		};
	}
	
	// Export data function
	function exportData() {
		const data = extractConversationData();
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		
		const a = document.createElement('a');
		a.href = url;
		a.download = `aistudio-conversation-${Date.now()}.json`;
		a.click();
		
		URL.revokeObjectURL(url);
		console.log('📁 Conversation data exported');
	}
	
	// Add export button to page
	function addExportButton() {
		if (document.querySelector('.export-btn')) return;
		
		const exportBtn = document.createElement('button');
		exportBtn.className = 'export-btn';
		exportBtn.textContent = '📊 Export Chat';
		exportBtn.style.cssText = `
		position: fixed;
		top: 10px;
		right: 10px;
		z-index: 10000;
		padding: 8px 12px;
		background: #4285f4;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 12px;
		`;
		exportBtn.onclick = exportData;
		
		document.body.appendChild(exportBtn);
	}
	
	addExportButton();
	
	// Make extraction function globally available
	window.exportAIStudioData = exportData;
	
})();
