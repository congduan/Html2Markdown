// 侧边栏脚本，处理HTML转Markdown和预览功能

// 等待DOM加载完成
window.addEventListener('DOMContentLoaded', () => {
  // 初始化变量
  let currentMarkdown = '';
  let currentHtml = ''; // 存储原始HTML，用于处理图片
  
  // 获取DOM元素
  const convertBtn = document.getElementById('convertBtn');
  const copyBtn = document.getElementById('copyBtn');
  const includeImages = document.getElementById('includeImages');
  const previewContent = document.getElementById('previewContent');
  const rawContent = document.getElementById('rawContent');
  const imagesContent = document.getElementById('imagesContent');
  const imageList = document.getElementById('imageList');
  const status = document.getElementById('status');
  const tabs = document.querySelectorAll('.tab');
  
  // 转换按钮点击事件
  convertBtn.addEventListener('click', async () => {
    try {
      status.textContent = '正在获取页面HTML...';
      console.log('开始转换HTML');
      
      // 检查Turndown库是否加载
      if (typeof TurndownService === 'undefined') {
        console.error('Turndown库未加载');
        status.textContent = '转换出错: Turndown库未加载';
        return;
      }
      
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('获取到标签页:', tab.id);
      
      // 尝试通过内容脚本获取页面HTML
      try {
        chrome.tabs.sendMessage(tab.id, { action: 'getPageHtml' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('发送消息失败:', chrome.runtime.lastError);
            // 内容脚本未加载，尝试使用executeScript获取页面HTML
            executeScriptToGetHtml(tab.id);
            return;
          }
          
          console.log('收到内容脚本响应:', response);
          
          if (response && response.html) {
            // 调用异步函数
            processHtml(response.html).catch(error => {
              console.error('处理HTML失败:', error);
              status.textContent = '处理HTML失败: ' + error.message;
            });
          } else {
            console.error('获取页面HTML失败，响应:', response);
            status.textContent = '获取页面HTML失败';
          }
        });
      } catch (error) {
        console.error('内容脚本通信失败:', error);
        // 内容脚本通信失败，尝试使用executeScript获取页面HTML
        executeScriptToGetHtml(tab.id);
      }
    } catch (error) {
      console.error('转换过程出错:', error);
      status.textContent = '转换出错: ' + error.message;
    }
  });
  
  // 使用executeScript获取页面HTML的备选方案
  function executeScriptToGetHtml(tabId) {
    console.log('尝试使用executeScript获取页面HTML');
    
    try {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: () => {
          // 在页面中执行的函数，获取页面主要内容
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
          
          return getMainContent();
        }
      }, (results) => {
        if (chrome.runtime.lastError) {
          console.error('executeScript失败:', chrome.runtime.lastError);
          status.textContent = '获取页面HTML失败，请刷新页面重试';
          return;
        }
        
        if (results && results[0] && results[0].result) {
          console.log('executeScript获取页面HTML成功，长度:', results[0].result.length);
          // 调用异步函数
          processHtml(results[0].result).catch(error => {
            console.error('处理HTML失败:', error);
            status.textContent = '处理HTML失败: ' + error.message;
          });
        } else {
          console.error('executeScript获取页面HTML失败，结果:', results);
          status.textContent = '获取页面HTML失败';
        }
      });
    } catch (error) {
      console.error('executeScript执行出错:', error);
      status.textContent = '获取页面HTML失败，请刷新页面重试';
    }
  }
  
  // 处理获取到的HTML
  async function processHtml(html) {
    status.textContent = '正在转换为Markdown...';
    
    try {
      // 存储原始HTML，用于处理图片
      currentHtml = html;
      console.log('存储原始HTML成功，长度:', currentHtml.length);
      
      // 配置turndown库，确保正确处理换行
      const turndownService = new TurndownService({
        breaks: true, // 保留换行符
        headingStyle: 'atx',
        bulletListMarker: '*',
        codeBlockStyle: 'fenced'
      });
      
      // 添加表格转换规则
      turndownService.addRule('table', {
        filter: 'table',
        replacement: function(content, node) {
          // 获取表格的所有行
          const rows = Array.from(node.querySelectorAll('tr'));
          if (rows.length === 0) return '';
          
          let markdown = '\n';
          
          // 处理表头
          const headerCells = Array.from(rows[0].querySelectorAll('th, td'));
          if (headerCells.length > 0) {
            // 添加表头行
            markdown += '| ' + headerCells.map(cell => cell.textContent.trim()).join(' | ') + ' |\n';
            // 添加分隔行
            markdown += '| ' + headerCells.map(() => '---').join(' | ') + ' |\n';
          }
          
          // 处理表格主体
          for (let i = 1; i < rows.length; i++) {
            const cells = Array.from(rows[i].querySelectorAll('td'));
            if (cells.length > 0) {
              markdown += '| ' + cells.map(cell => cell.textContent.trim()).join(' | ') + ' |\n';
            }
          }
          
          return markdown + '\n';
        }
      });
      console.log('创建TurndownService实例成功');
      console.log('添加表格转换规则成功');
      
      // 先转换HTML为Markdown
      let tempMarkdown = turndownService.turndown(html);
      console.log('转换为Markdown成功，长度:', tempMarkdown.length);
      
      // 处理图片，使用HTML标签并保留原始尺寸
      console.log('开始处理图片尺寸');
      
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // 使用executeScript在页面中执行代码，获取所有图片的尺寸
      const processedMarkdown = await new Promise((resolve, reject) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: (markdown) => {
            // 在页面中执行的函数，获取图片尺寸并处理Markdown
            function processImagesWithDimensions(markdownText) {
              // 匹配Markdown中的图片语法: ![alt](url)
              return markdownText.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
                try {
                  // 查找原始img元素
                  const imgElements = document.querySelectorAll('img');
                  let targetImg = null;
                  
                  // 尝试找到匹配的图片元素
                  for (const img of imgElements) {
                    if (img.src === url || img.src.includes(url)) {
                      targetImg = img;
                      break;
                    }
                  }
                  
                  if (targetImg) {
                    // 获取图片的原始尺寸
                    const width = targetImg.naturalWidth || targetImg.width || 0;
                    const height = targetImg.naturalHeight || targetImg.height || 0;
                    
                    // 生成带尺寸的HTML img标签，并添加最大宽度限制
                    let imgTag = `<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto;"`;
                    
                    if (width > 0) {
                      imgTag += ` width="${width}"`;
                    }
                    if (height > 0) {
                      imgTag += ` height="${height}"`;
                    }
                    
                    imgTag += `>`;
                    
                    return imgTag;
                  } else {
                    // 如果找不到对应的图片元素，返回原始匹配
                    return match;
                  }
                } catch (error) {
                  console.error('处理图片尺寸失败:', error);
                  return match;
                }
              });
            }
            
            return processImagesWithDimensions(markdown);
          },
          args: [tempMarkdown]
        }, (results) => {
          if (chrome.runtime.lastError) {
            console.error('executeScript失败:', chrome.runtime.lastError);
            resolve(tempMarkdown);
            return;
          }
          
          if (results && results[0] && results[0].result) {
            resolve(results[0].result);
          } else {
            resolve(tempMarkdown);
          }
        });
      });
      
      currentMarkdown = processedMarkdown;
      console.log('处理图片尺寸完成');
      console.log('最终Markdown长度:', currentMarkdown.length);
      
      // 更新原始Markdown内容，使用pre标签保留换行
      rawContent.innerHTML = '<pre style="white-space: pre-wrap; font-family: monospace;">' + 
        currentMarkdown.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + 
        '</pre>';
      console.log('更新原始Markdown内容成功');
      
      // 确保currentMarkdown变量正确存储原始Markdown
      console.log('原始Markdown前100个字符:', currentMarkdown.substring(0, 100));
      console.log('原始Markdown是否包含换行:', currentMarkdown.includes('\n'));
      
      // 使用marked库将Markdown转换为HTML进行预览
      let previewHtml;
      try {
        // 尝试不同的marked调用方式
        if (typeof marked === 'function') {
          previewHtml = marked(currentMarkdown);
        } else if (typeof marked.marked === 'function') {
          previewHtml = marked.marked(currentMarkdown);
        } else {
          throw new Error('marked库未正确初始化');
        }
        console.log('转换为HTML预览成功');
        previewContent.innerHTML = previewHtml;
      } catch (error) {
        console.error('Markdown预览出错:', error);
        // 如果marked库不可用，直接显示原始Markdown
        previewContent.textContent = currentMarkdown;
      }
      
      // 获取并更新图片列表
      await updateImageList();
      
      status.textContent = '转换完成';
      console.log('转换过程全部完成');
    } catch (error) {
      console.error('转换过程出错:', error);
      status.textContent = '转换出错: ' + error.message;
    }
  }
  
  // 复制按钮点击事件
  copyBtn.addEventListener('click', async () => {
    if (!currentMarkdown) {
      status.textContent = '请先转换HTML';
      return;
    }
    
    try {
      status.textContent = '正在准备复制...';
      
      let markdownToCopy = currentMarkdown;
      
      // 检查是否需要包含图片
      if (includeImages.checked) {
        status.textContent = '正在处理图片...';
        console.log('开始处理图片');
        
        // 处理图片，移除base64图片
        try {
          // 移除base64图片
          markdownToCopy = markdownToCopy.replace(/<img[^>]*src="data:image\/[^>]*"[^>]*>/gi, '');
          console.log('移除base64图片完成');
        } catch (error) {
          console.error('处理图片出错:', error);
          // 处理图片失败，使用原始Markdown
          markdownToCopy = currentMarkdown;
        }
      } else {
        // 不包含图片，移除所有图片标签
        markdownToCopy = markdownToCopy.replace(/<img[^>]*>/gi, '');
        console.log('移除所有图片完成');
      }
      
      // 复制到剪贴板
      await navigator.clipboard.writeText(markdownToCopy);
      status.textContent = '已复制到剪贴板';
      console.log('复制到剪贴板成功');
      
      // 3秒后恢复状态
      setTimeout(() => {
        status.textContent = '就绪';
      }, 3000);
    } catch (error) {
      console.error('复制失败:', error);
      status.textContent = '复制失败: ' + error.message;
    }
  });
  

  
  // 标签切换事件
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 移除所有标签的活动状态
      tabs.forEach(t => t.classList.remove('active'));
      // 添加当前标签的活动状态
      tab.classList.add('active');
      
      const tabId = tab.dataset.tab;
      
      // 隐藏所有内容
      previewContent.style.display = 'none';
      rawContent.style.display = 'none';
      imagesContent.style.display = 'none';
      
      // 显示对应内容
      if (tabId === 'preview') {
        previewContent.style.display = 'block';
      } else if (tabId === 'raw') {
        rawContent.style.display = 'block';
      } else if (tabId === 'images') {
        imagesContent.style.display = 'block';
      }
    });
  });
  
  // 更新图片列表
  async function updateImageList() {
    try {
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // 使用executeScript在页面中执行代码，获取所有图片
      const images = await new Promise((resolve, reject) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            // 在页面中执行的函数，获取所有图片
            function getAllImages() {
              const images = [];
              const imgElements = document.querySelectorAll('img');
              
              imgElements.forEach((img, index) => {
                if (img.src) {
                  images.push({
                    src: img.src,
                    alt: img.alt || `image-${index}`,
                    index: index,
                    width: img.naturalWidth || img.width || 0,
                    height: img.naturalHeight || img.height || 0
                  });
                }
              });
              
              return images;
            }
            
            return getAllImages();
          }
        }, (results) => {
          if (chrome.runtime.lastError) {
            console.error('executeScript失败:', chrome.runtime.lastError);
            resolve([]);
            return;
          }
          
          if (results && results[0] && results[0].result) {
            resolve(results[0].result);
          } else {
            resolve([]);
          }
        });
      });
      
      console.log('获取到图片数量:', images.length);
      
      // 清空图片列表
      imageList.innerHTML = '';
      
      if (images.length === 0) {
        imageList.innerHTML = '<div class="no-images">页面中没有找到图片</div>';
        return;
      }
      
      // 添加图片项
      images.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        
        // 生成文件名
        let extension = 'jpg';
        if (image.src.startsWith('data:image/')) {
          // 从base64数据中提取图片类型
          const match = image.src.match(/data:image\/(.*?);base64/);
          if (match && match[1]) {
            extension = match[1].split('+')[0]; // 处理类似image/svg+xml的情况
          }
        } else {
          // 从URL中提取扩展名
          const urlParts = image.src.split('.');
          extension = urlParts[urlParts.length - 1].split('?')[0].split('#')[0];
        }
        const paddedIndex = String(index + 1).padStart(3, '0');
        const fileName = `image-${paddedIndex}.${extension}`;
        
        imageItem.innerHTML = `
          <img src="${image.src}" alt="${image.alt}" class="image-preview">
          <div class="image-info">
            <div>文件名: ${fileName}</div>
            <div>尺寸: ${image.width}x${image.height}</div>
            <div>URL: ${image.src.startsWith('data:image/') ? 'base64图片' : image.src.substring(0, 50)}${!image.src.startsWith('data:image/') && image.src.length > 50 ? '...' : ''}</div>
          </div>
          <div class="image-actions">
            <button class="download-btn" data-src="${image.src}" data-filename="${fileName}">下载图片</button>
          </div>
        `;
        
        imageList.appendChild(imageItem);
      });
      
      // 添加下载按钮事件监听器
      document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const src = this.dataset.src;
          const filename = this.dataset.filename;
          
          // 创建下载链接
          const link = document.createElement('a');
          link.href = src;
          link.download = filename;
          link.target = '_blank';
          
          // 模拟点击下载
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // 更新状态
          status.textContent = `正在下载: ${filename}`;
          setTimeout(() => {
            status.textContent = '就绪';
          }, 2000);
        });
      });
      
    } catch (error) {
      console.error('更新图片列表失败:', error);
      imageList.innerHTML = '<div class="no-images">获取图片列表失败</div>';
    }
  }
});