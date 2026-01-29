# Html2Markdown Chrome 扩展

一个将网页内容转换为 Markdown 格式的 Chrome 浏览器扩展。

## 语言 | Language

[English](README.md) | **中文**

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