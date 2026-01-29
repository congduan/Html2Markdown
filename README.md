# Html2Markdown Chrome Extension

A Chrome browser extension that converts web page content to Markdown format.

## Language

<button onclick="switchLanguage('en')" id="btn-en" style="padding: 4px 8px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">English</button>
<button onclick="switchLanguage('zh')" id="btn-zh" style="padding: 4px 8px; background-color: #ddd; color: #333; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">中文</button>

<script>
function switchLanguage(lang) {
  if (lang === 'en') {
    document.getElementById('content-en').style.display = 'block';
    document.getElementById('content-zh').style.display = 'none';
    document.getElementById('btn-en').style.backgroundColor = '#4CAF50';
    document.getElementById('btn-en').style.color = 'white';
    document.getElementById('btn-zh').style.backgroundColor = '#ddd';
    document.getElementById('btn-zh').style.color = '#333';
  } else {
    document.getElementById('content-en').style.display = 'none';
    document.getElementById('content-zh').style.display = 'block';
    document.getElementById('btn-en').style.backgroundColor = '#ddd';
    document.getElementById('btn-en').style.color = '#333';
    document.getElementById('btn-zh').style.backgroundColor = '#4CAF50';
    document.getElementById('btn-zh').style.color = 'white';
  }
}
</script>

<div id="content-en">

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

</div>

<div id="content-zh" style="display: none;">

# Html2Markdown Chrome 扩展

一个将网页内容转换为 Markdown 格式的 Chrome 浏览器扩展。

## 功能特性

- 📋 一键转换网页内容为 Markdown
- 🎨 保留原始格式和结构
- 🖼️ 支持图片处理
- 🔗 保留链接和引用
- 📄 支持多种常见 HTML 元素
- 🎯 简单易用的侧边栏界面

## 安装方法

### 从源码安装（开发者模式）

1. 克隆本仓库到本地：
   ```bash
   git clone git@github.com:congduan/Html2Markdown.git
   ```

2. 打开 Chrome 浏览器，进入扩展管理页面：
   - 地址栏输入 `chrome://extensions/`
   - 开启右上角的「开发者模式」

3. 点击「加载已解压的扩展程序」，选择克隆的项目目录

4. 扩展安装完成，可在浏览器工具栏看到扩展图标

## 使用方法

1. 打开需要转换的网页
2. 点击浏览器工具栏中的扩展图标
3. 侧边栏会显示转换后的 Markdown 内容
4. 可直接复制转换后的 Markdown 文本

## 项目结构

```
Html2Markdown/
├── background.js       # 扩展后台脚本
├── content.js          # 内容脚本，用于处理网页内容
├── manifest.json       # 扩展配置文件
├── sidebar.html        # 侧边栏界面
├── sidebar.js          # 侧边栏逻辑
├── icons/              # 扩展图标
├── libs/               # 依赖库
└── README.md           # 项目说明
```

## 技术实现

- 使用 Chrome 扩展 API
- 原生 JavaScript 实现 HTML 到 Markdown 的转换
- 响应式侧边栏设计

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 许可证

MIT License

## 联系方式

- GitHub: [congduan](https://github.com/congduan)

</div>