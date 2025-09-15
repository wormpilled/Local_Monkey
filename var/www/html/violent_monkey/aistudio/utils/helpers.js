

// FILE: /var/www/html/violent_monkey/aistudio/utils/helpers.js
(function() {
	'use strict';
	
	// Global utilities for AI Studio scripts
	window.AIStudioUtils = {
		
		// Wait for element to appear
		waitForElement: function(selector, timeout = 5000) {
			return new Promise((resolve, reject) => {
				const element = document.querySelector(selector);
				if (element) return resolve(element);
				
				const observer = new MutationObserver(() => {
					const element = document.querySelector(selector);
					if (element) {
						observer.disconnect();
						resolve(element);
					}
				});
				
				observer.observe(document.body, { childList: true, subtree: true });
				
				setTimeout(() => {
					observer.disconnect();
					reject(new Error(`Element ${selector} not found within ${timeout}ms`));
				}, timeout);
			});
		},
 
 // Debounce function calls
 debounce: function(func, wait) {
	 let timeout;
	 return function executedFunction(...args) {
		 const later = () => {
			 clearTimeout(timeout);
			 func(...args);
		 };
		 clearTimeout(timeout);
		 timeout = setTimeout(later, wait);
	 };
 },
 
 // Check if element is in viewport
 isInViewport: function(element) {
	 const rect = element.getBoundingClientRect();
	 return (
		 rect.top >= 0 &&
		 rect.left >= 0 &&
		 rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		 rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	 );
 },
 
 // Simple logger with timestamps
 log: function(message, level = 'info') {
	 const timestamp = new Date().toLocaleTimeString();
	 const prefix = `[${timestamp}] [AI Studio Utils]`;
	 console[level](`${prefix} ${message}`);
 }
	};
	
	console.log('🔧 AI Studio Utilities loaded');
	
})();
