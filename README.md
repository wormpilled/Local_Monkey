# Local Monkey - Violent Monky Controllers

This project provides a complete, professional local development environment for creating complex and modular browser userscripts for extensions like Violentmonkey and Tampermonkey.

It solves common frustrations with userscript development, such as being forced to use the browser's basic editor and dealing with script caching issues. By hosting scripts on a local webserver, you can use your favorite code editor and benefit from hot-reloading for a more efficient workflow.

---

## The Core Concept: Master Controller

Instead of installing multiple scripts for a single website, this setup uses a **Master Controller** pattern.

1. **One Script to Rule Them All**  
   You only install a single `master.user.js` file into Violentmonkey/Tampermonkey for each project.

2. **Dynamic Loading**  
   This master script acts as a bootloader. It dynamically fetches and injects other JavaScript modules and CSS files from your local webserver (`http://127.0.0.1/`).

3. **Modular & Organized**  
   This allows you to break down complex features into smaller, more manageable files. The master script controls *when* and *if* these modules are loaded based on page conditions, user interactions, or other triggers.

This approach makes your userscript projects easier to maintain, update, debug, and expand.

---

## Features

- 🚀 **Hot Reloading** – Scripts are fetched with a `no-cache` header, ensuring your latest changes are loaded every time you refresh the target website.  
- 🧩 **Modular Architecture** – Keep your code clean and organized by separating features, utilities, and styles into different files and directories.  
- 💡 **Conditional Loading** – Configure scripts to load only when certain conditions are met (e.g., a specific element exists on the page).  
- ⏰ **Advanced Trigger System** – Control precisely when your scripts execute, such as on `document-ready`, after a `user-interaction`, or loaded manually via an API call.  
- 🛠️ **Enhanced Debugging** – Get detailed console logs for script loading, success, and errors. Debug directly in your browser’s developer tools with proper file separation.  
- 📂 **Scalable Project Structure** – Directory layout is designed to handle multiple distinct userscript projects (e.g., `aistudio`, `another-project`) and shared common utilities.  
- 🌐 **Localhost Dashboard** – An `index.html` page provides a convenient dashboard to view your projects and access script files.  

---

## Setup and Installation

### Prerequisites

You need a local web server (like Apache or Nginx) running and configured to serve files from `/var/www/html/`.

### Step 1: Create the Directory Structure

Save the following script as `setup_environment.sh`, make it executable, and run it. This will create all necessary directories and files.

**`setup_environment.sh`**
```bash
#!/bin/bash

# --- Configuration ---
TARGET_USER=${SUDO_USER:-$(whoami)}
WEB_ROOT="/var/www/html"
PROJECT_DIR="$WEB_ROOT/violent_monkey"

echo "🚀 Creating userscript development environment..."

# Create project structure
sudo mkdir -p "$PROJECT_DIR/shared/{utils,styles}"
sudo mkdir -p "$PROJECT_DIR/aistudio/{scripts,utils,styles}"
echo "   -> Directories created."

# Create placeholder files
sudo touch "$PROJECT_DIR/index.html"
sudo touch "$PROJECT_DIR/shared/utils/common.js"
sudo touch "$PROJECT_DIR/shared/styles/base.css"
sudo touch "$PROJECT_DIR/aistudio/master.user.js"
sudo touch "$PROJECT_DIR/aistudio/scripts/chat-enhancer.js"
sudo touch "$PROJECT_DIR/aistudio/scripts/ui-tweaks.js"
sudo touch "$PROJECT_DIR/aistudio/scripts/auto-actions.js"
sudo touch "$PROJECT_DIR/aistudio/scripts/data-extractor.js"
sudo touch "$PROJECT_DIR/aistudio/utils/helpers.js"
sudo touch "$PROJECT_DIR/aistudio/styles/custom.css"
echo "   -> Placeholder files created."

# Set ownership and permissions
sudo chown -R "$TARGET_USER:$TARGET_USER" "$PROJECT_DIR"
sudo chmod -R 755 "$PROJECT_DIR"
echo "   -> Permissions set for user '$TARGET_USER'."

echo "✅ Environment created successfully!"
echo "📁 Structure located at: $PROJECT_DIR"
echo "🌐 Access your dashboard at: http://127.0.0.1/violent_monkey/"
````

**Run the script:**

```sh
chmod +x setup_environment.sh
sudo ./setup_environment.sh
```

### Step 2: Populate Your Files

Copy the provided HTML, CSS, and JavaScript code into the corresponding empty files created by the setup script.
For example: copy the master controller code into:
`/var/www/html/violent_monkey/aistudio/master.user.js`

### Step 3: Install the Master Userscript

1. Open your browser and navigate to the Violentmonkey (or Tampermonkey) dashboard.
2. Create a new userscript.
3. Delete the default template content.
4. Copy the entire content of your local `master.user.js` file and paste it into the editor.
5. Save the script.

This is the **only** script you need to install in your browser extension.

---

## Development Workflow

1. **Edit Locally** – Open `/var/www/html/violent_monkey/` in your preferred editor.
2. **Make Changes** – Modify any of the modular script files (e.g., `aistudio/scripts/ui-tweaks.js`).
3. **Save** – Save your changes.
4. **Reload** – Refresh the target website (e.g., `aistudio.com`).
5. **See Results** – The `master.user.js` automatically fetches the updated script from your local server.

Check the browser’s developer console for logs and debugging information.

---

## Directory Structure

The setup script creates the following structure:

```
/var/www/html/violent_monkey/
├── index.html
├── shared/
│   ├── utils/common.js
│   └── styles/base.css
└── aistudio/
    ├── master.user.js
    ├── scripts/
    │   ├── chat-enhancer.js
    │   ├── ui-tweaks.js
    │   ├── auto-actions.js
    │   └── data-extractor.js
    ├── utils/helpers.js
    └── styles/custom.css
```

---

## Adding a New Script to a Project

1. Create a new file, e.g. `aistudio/scripts/new-feature.js`.
2. Open `aistudio/master.user.js`.
3. Add an entry to the `CONFIG.scripts` array:

```javascript
const CONFIG = {
  scripts: [
    {
      name: 'new-feature',
      file: 'scripts/new-feature.js',
      enabled: true,
      runOn: ['document-ready'],
      conditions: () => document.querySelector('.new-feature-target-element')
    }
  ]
};
```

4. Write your code in `new-feature.js`.
5. Refresh the target website to test.

# IMPORTANT:
[Read TRACKING.md
](https://github.com/wormpilled/Local_Monkey/blob/main/TRACKING.md) 
