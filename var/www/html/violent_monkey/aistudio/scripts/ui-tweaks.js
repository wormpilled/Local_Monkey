
// FILE: /var/www/html/violent_monkey/aistudio/scripts/ui-tweaks.js
(function() {
	'use strict';
	
	console.log('🎨 UI Tweaks loaded');
	
	// Add custom styles and UI improvements
	function applyUITweaks() {
		// Add custom CSS classes for better styling
		document.body.classList.add('aistudio-enhanced');
		
		// Improve sidebar visibility
		const sidebar = document.querySelector('.sidebar, nav, [data-testid="sidebar"]');
		if (sidebar && !sidebar.classList.contains('enhanced')) {
			sidebar.classList.add('enhanced');
			sidebar.style.cssText += 'border-right: 2px solid #e0e0e0; box-shadow: 2px 0 10px rgba(0,0,0,0.1);';
		}
		
		// Add keyboard shortcut indicators
		const buttons = document.querySelectorAll('button:not(.shortcut-enhanced)');
		buttons.forEach((btn, index) => {
			if (btn.textContent.includes('Send') || btn.textContent.includes('Submit')) {
				btn.classList.add('shortcut-enhanced');
				btn.title = 'Ctrl+Enter to send';
			}
		});
	}
	
	// Apply tweaks
	applyUITweaks();
	
	// Reapply on DOM changes
	const observer = new MutationObserver(() => {
		setTimeout(applyUITweaks, 100);
	});
	observer.observe(document.body, { childList: true, subtree: true });
	
})();
