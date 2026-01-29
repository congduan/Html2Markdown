// 内容脚本，注入到网页中执行HTML转Markdown操作

// 等待DOM加载完成
window.addEventListener('DOMContentLoaded', () => {
  // 这里我们会在侧边栏请求时执行转换操作
  // 目前只是注册消息监听器
});

// 处理来自后台或侧边栏的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getPageHtml") {
    // 获取当前页面的主要内容
    function getMainContent() {
      // 尝试获取主要内容区域
      const mainElements = [
        document.querySelector('main'),
        document.querySelector('article'),
        document.querySelector('.main-content'),
        document.querySelector('.content'),
        document.body
      ];
      
      let mainContent = null;
      for (const element of mainElements) {
        if (element) {
          mainContent = element;
          break;
        }
      }
      
      if (!mainContent) {
        return document.documentElement.outerHTML;
      }
      
      // 克隆元素，移除脚本和样式
      const clonedContent = mainContent.cloneNode(true);
      
      // 移除脚本标签
      const scripts = clonedContent.querySelectorAll('script');
      scripts.forEach(script => script.remove());
      
      // 移除样式标签
      const styles = clonedContent.querySelectorAll('style');
      styles.forEach(style => style.remove());
      
      // 移除link标签（通常是外部样式）
      const links = clonedContent.querySelectorAll('link[rel="stylesheet"]');
      links.forEach(link => link.remove());
      
      return clonedContent.outerHTML;
    }
    
    const pageHtml = getMainContent();
    sendResponse({ html: pageHtml });
  }
});