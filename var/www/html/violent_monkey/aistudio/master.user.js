// ==UserScript==
// @name         AI Studio Master Controller
// @namespace    http://127.0.0.1/violent_monkey/
// @version      1.0.1
// @description  Master controller for AI Studio enhancements
// @author       You
// @match        https://aistudio.google.com/*
// @match        https://aistudio.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function() {
	'use strict';
	
	// Configuration
	const CONFIG = {
		baseUrl: 'http://127.0.0.1/violent_monkey/aistudio/',
 debug: true,
 scripts: [
	 {
		 name: 'chat-enhancer',
 file: 'scripts/chat-enhancer.js',
 enabled: true,
 runOn: ['document-ready'],
 conditions: () => document.querySelector('.chat-container, [data-testid="chat"]')
	 },
 {
	 name: 'ui-tweaks',
 file: 'scripts/ui-tweaks.js',
 enabled: true,
 runOn: ['document-ready'],
 conditions: () => true // Always run
 },
 {
	 name: 'auto-actions',
 file: 'scripts/auto-actions.js',
 enabled: true,
 runOn: ['user-interaction'],
 conditions: () => document.querySelector('.action-button, button[type="submit"]')
 },
 {
	 name: 'data-extractor',
 file: 'scripts/data-extractor.js',
 enabled: false, // Disabled by default
 runOn: ['manual'],
 conditions: () => true
 }
 ],
 styles: [
	 'styles/custom.css'
 ],
 utils: [
	 'utils/helpers.js'
 ]
	};
	
	// Script Manager Class
	class ScriptManager {
		constructor() {
			this.loadedScripts = new Set();
			this.loadedStyles = new Set();
			this.scriptCache = new Map();
			this.isReady = false;
			
			this.log('🚀 AI Studio Master Controller initialized');
			this.init();
		}
		
		log(message, type = 'info') {
			if (!CONFIG.debug) return;
			const prefix = '[AI Studio Master]';
			const styles = {
				info: 'color: #2196F3',
 success: 'color: #4CAF50',
 warning: 'color: #FF9800',
 error: 'color: #F44336'
			};
			console.log(`%c${prefix} ${message}`, styles[type] || styles.info);
		}
		
		async init() {
			// Load utilities first
			await this.loadUtilities();
			
			// Load styles
			await this.loadStyles();
			
			// Set up event listeners
			this.setupEventListeners();
			
			// Start loading scripts based on document state
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', () => this.onDocumentReady());
			} else {
				this.onDocumentReady();
			}
		}
		
		async loadUtilities() {
			for (const util of CONFIG.utils) {
				await this.loadScript(`${CONFIG.baseUrl}${util}`, 'utility');
			}
		}
		
		async loadStyles() {
			for (const style of CONFIG.styles) {
				await this.loadCSS(`${CONFIG.baseUrl}${style}`);
			}
		}
		
		setupEventListeners() {
			// User interaction events
			document.addEventListener('click', () => this.onUserInteraction(), { passive: true });
			document.addEventListener('keydown', () => this.onUserInteraction(), { passive: true });
			
			// URL change detection for SPA
			let currentUrl = location.href;
			const observer = new MutationObserver(() => {
				if (location.href !== currentUrl) {
					currentUrl = location.href;
					this.onUrlChange();
				}
			});
			observer.observe(document, { subtree: true, childList: true });
		}
		
		async onDocumentReady() {
			this.isReady = true;
			this.log('📄 Document ready, loading scripts...');
			
			// Force load utilities first (they should already be loaded, but just to be sure)
			await this.loadScriptsByTrigger('document-ready');
			
			// Add manual trigger button for testing
			setTimeout(() => this.addDebugControls(), 2000);
		}
		
		async onUserInteraction() {
			if (!this.isReady) return;
			await this.loadScriptsByTrigger('user-interaction');
		}
		
		async onUrlChange() {
			this.log('🔄 URL changed, re-evaluating scripts...');
			await this.loadScriptsByTrigger('document-ready');
		}
		
		async loadScriptsByTrigger(trigger) {
			const scriptsToLoad = CONFIG.scripts.filter(script => 
			script.enabled && 
			script.runOn.includes(trigger) &&
			!this.loadedScripts.has(script.name)
			);
			
			this.log(`🔍 Checking ${scriptsToLoad.length} scripts for trigger: ${trigger}`);
			
			for (const script of scriptsToLoad) {
				try {
					// Check conditions
					const conditionsMet = script.conditions();
					this.log(`📋 Script ${script.name}: conditions ${conditionsMet ? '✅ met' : '❌ not met'}`);
					
					if (conditionsMet) {
						await this.loadScript(`${CONFIG.baseUrl}${script.file}`, script.name);
						this.loadedScripts.add(script.name);
					}
				} catch (error) {
					this.log(`❌ Error processing script ${script.name}: ${error.message}`, 'error');
				}
			}
		}
		
		async loadScript(url, name) {
			if (this.scriptCache.has(url)) {
				this.log(`📋 Using cached script: ${name}`);
				return this.scriptCache.get(url);
			}
			
			try {
				this.log(`📥 Loading script: ${name} from ${url}`);
				
				// Use GM_xmlhttpRequest to bypass CORS restrictions
				const scriptContent = await new Promise((resolve, reject) => {
					GM_xmlhttpRequest({
						method: 'GET',
						url: url,
						headers: {
							'Cache-Control': 'no-cache',
							'Pragma': 'no-cache'
						},
						onload: function(response) {
							if (response.status === 200) {
								resolve(response.responseText);
							} else {
								reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
							}
						},
						onerror: function(response) {
							reject(new Error(`Network error: ${response.statusText || 'Unknown error'}`));
						},
						ontimeout: function() {
							reject(new Error('Request timeout'));
						},
						timeout: 10000 // 10 second timeout
					});
				});
				
				// Execute script content directly using eval in global scope
				// This ensures proper execution of IIFEs and maintains scope
				try {
					// Use indirect eval to execute in global scope
					(1, eval)(scriptContent);
					this.log(`✅ Successfully executed: ${name}`, 'success');
				} catch (execError) {
					this.log(`❌ Script execution error in ${name}: ${execError.message}`, 'error');
					console.error('Script execution error:', execError);
					
					// Fallback: try the old method
					const script = document.createElement('script');
					script.textContent = scriptContent;
					document.head.appendChild(script);
					this.log(`🔄 Fallback injection attempted for: ${name}`, 'warning');
				}
				
				this.scriptCache.set(url, scriptContent);
				return scriptContent;
				
			} catch (error) {
				this.log(`❌ Failed to load ${name}: ${error.message}`, 'error');
				throw error;
			}
		}
		
		async loadCSS(url) {
			if (this.loadedStyles.has(url)) return;
			
			try {
				// Use GM_xmlhttpRequest for CSS as well
				const cssContent = await new Promise((resolve, reject) => {
					GM_xmlhttpRequest({
						method: 'GET',
						url: url,
						headers: {
							'Cache-Control': 'no-cache',
							'Pragma': 'no-cache'
						},
						onload: function(response) {
							if (response.status === 200) {
								resolve(response.responseText);
							} else {
								reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
							}
						},
						onerror: function(response) {
							reject(new Error(`Network error: ${response.statusText || 'Unknown error'}`));
						},
						timeout: 5000
					});
				});
				
				const style = document.createElement('style');
				style.textContent = cssContent;
				document.head.appendChild(style);
				
				this.loadedStyles.add(url);
				this.log(`🎨 Loaded stylesheet: ${url.split('/').pop()}`, 'success');
				
			} catch (error) {
				this.log(`❌ Failed to load CSS ${url}: ${error.message}`, 'error');
			}
		}
		
		
		addDebugControls() {
			if (document.querySelector('.debug-controls')) return;
			
			const debugPanel = document.createElement('div');
			debugPanel.className = 'debug-controls';
			debugPanel.style.cssText = `
			position: fixed;
			top: 10px;
			left: 10px;
			z-index: 10000;
			background: rgba(0,0,0,0.8);
			color: white;
			padding: 10px;
			border-radius: 5px;
			font-family: monospace;
			font-size: 12px;
			`;
			
			const loadedList = Array.from(this.loadedScripts).join(', ') || 'none';
			debugPanel.innerHTML = `
			<div><strong>🐒 AI Studio Master</strong></div>
			<div>Loaded: ${loadedList}</div>
			<button onclick="window.AIStudioMaster.forceLoadAll()" style="margin-top: 5px; padding: 2px 8px; background: #4285f4; color: white; border: none; border-radius: 3px; cursor: pointer;">Force Load All</button>
			<button onclick="window.AIStudioMaster.testChatEnhancer()" style="margin-top: 2px; padding: 2px 8px; background: #34a853; color: white; border: none; border-radius: 3px; cursor: pointer;">Test Chat Enhancer</button>
			`;
			
			document.body.appendChild(debugPanel);
		}
		
		async forceLoadAll() {
			this.log('🔧 Force loading all scripts...');
			for (const script of CONFIG.scripts) {
				if (!this.loadedScripts.has(script.name)) {
					try {
						await this.loadScript(`${CONFIG.baseUrl}${script.file}`, script.name);
						this.loadedScripts.add(script.name);
					} catch (error) {
						this.log(`❌ Failed to force load ${script.name}: ${error.message}`, 'error');
					}
				}
			}
			this.updateDebugDisplay();
		}
		
		async testChatEnhancer() {
			this.log('🧪 Testing chat enhancer specifically...');
			try {
				await this.loadScript(`${CONFIG.baseUrl}scripts/chat-enhancer.js`, 'chat-enhancer-test');
				this.log('✅ Chat enhancer test load completed');
			} catch (error) {
				this.log(`❌ Chat enhancer test failed: ${error.message}`, 'error');
			}
		}
		
		updateDebugDisplay() {
			const debugPanel = document.querySelector('.debug-controls');
			if (debugPanel) {
				const loadedList = Array.from(this.loadedScripts).join(', ') || 'none';
				debugPanel.querySelector('div:nth-child(2)').textContent = `Loaded: ${loadedList}`;
			}
		}
		async loadScriptManually(scriptName) {
			const script = CONFIG.scripts.find(s => s.name === scriptName);
			if (!script) {
				this.log(`❌ Script not found: ${scriptName}`, 'error');
				return false;
			}
			
			if (this.loadedScripts.has(scriptName)) {
				this.log(`⚠️ Script already loaded: ${scriptName}`, 'warning');
				return true;
			}
			
			try {
				await this.loadScript(`${CONFIG.baseUrl}${script.file}`, script.name);
				this.loadedScripts.add(script.name);
				return true;
			} catch (error) {
				return false;
			}
		}
		
		// Utility methods available to child scripts
		getConfig() {
			return CONFIG;
		}
		
		getLoadedScripts() {
			return Array.from(this.loadedScripts);
		}
	}
	
	// Initialize the master controller
	window.AIStudioMaster = new ScriptManager();
	
	// Global utilities for child scripts
	window.loadAIStudioScript = (scriptName) => window.AIStudioMaster.loadScriptManually(scriptName);
	
})();
