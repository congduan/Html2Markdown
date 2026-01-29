# Html2Markdown Chrome Extension

A Chrome browser extension that converts web page content to Markdown format.

## Language

**English** | [中文](README.zh.md)

## Features

- 📋 One-click conversion of web content to Markdown
- 🎨 Preserves original formatting and structure
- 🖼️ Supports image processing
- 🔗 Preserves links and references
- 📄 Supports various common HTML elements
- 🎯 Simple and easy-to-use sidebar interface

## Installation

### Install from Source (Developer Mode)

1. Clone this repository to your local machine:
   ```bash
   git clone git@github.com:congduan/Html2Markdown.git
   ```

2. Open Chrome browser and go to the extensions management page:
   - Enter `chrome://extensions/` in the address bar
   - Enable "Developer mode" in the top right corner

3. Click "Load unpacked" and select the cloned project directory

4. The extension is installed, and you can see the extension icon in the browser toolbar

## Usage

1. Open the web page you want to convert
2. Click the extension icon in the browser toolbar
3. The sidebar will display the converted Markdown content
4. You can directly copy the converted Markdown text

## Project Structure

```
Html2Markdown/
├── background.js       # Extension background script
├── content.js          # Content script for processing web page content
├── manifest.json       # Extension configuration file
├── sidebar.html        # Sidebar interface
├── sidebar.js          # Sidebar logic
├── icons/              # Extension icons
├── libs/               # Dependent libraries
└── README.md           # Project documentation
```

## Technical Implementation

- Uses Chrome Extension API
- Native JavaScript implementation of HTML to Markdown conversion
- Responsive sidebar design

## Contribution

Welcome to submit Issues and Pull Requests to improve this project!

## License

MIT License

## Contact

- GitHub: [congduan](https://github.com/congduan)