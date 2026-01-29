// 后台脚本，处理插件的核心逻辑

console.log('Background script loaded');

// 当用户点击插件图标时，打开侧边栏
chrome.action.onClicked.addListener((tab) => {
  console.log('Action clicked, opening side panel for tab:', tab.id, 'URL:', tab.url);
  
  // 检查是否是chrome://开头的内部页面
  if (tab.url && tab.url.startsWith('chrome://')) {
    console.log('Skipping side panel for chrome:// URL:', tab.url);
    // 可以考虑添加通知，但需要额外权限
    return; // 不打开侧边栏
  }
  
  // 先设置侧边栏选项
  chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: "sidebar.html",
    enabled: true
  }, () => {
    console.log('Side panel options set');
    
    // 直接打开侧边栏，确保在用户手势响应中调用
    chrome.sidePanel.open({ tabId: tab.id }, () => {
      console.log('Side panel opened');
    });
  });
});

// 处理来自内容脚本的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  
  if (message.action === "convertHtmlToMarkdown") {
    // 这里可以处理HTML转Markdown的逻辑
    // 但实际上我们会在内容脚本中直接使用turndown库
    sendResponse({ success: true });
  } else if (message.action === "getPageHtml") {
    // 处理来自侧边栏的获取页面HTML的请求
    sendResponse({ success: true });
  }
});

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});