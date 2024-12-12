document.addEventListener("DOMContentLoaded", () => {
  const resourceList = document.getElementById("resource-list");
  const exportButton = document.getElementById("export-button");
  const copyButton = document.getElementById("copy-button");

  let currentHostname = "unknown"; // 用于保存当前域名

  // 获取资源路径并显示
  chrome.runtime.sendMessage({ type: "getResources" }, (response) => {
    if (response && response.length > 0) {
      response.forEach((url) => {
        const listItem = document.createElement("li");
        listItem.textContent = url;
        resourceList.appendChild(listItem);
      });
    } else {
      resourceList.textContent = "not found";
    }
  });

  // 获取当前标签页的域名
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url);
    currentHostname = url.hostname; // 提取域名
  });

  // 复制功能
  copyButton.addEventListener("click", () => {
    const urls = [];
    document.querySelectorAll("#resource-list li").forEach((li) => {
      urls.push(li.textContent);
    });

    if (urls.length === 0) {
      return;
    }

    // 拼接所有 URL 为多行文本
    const textToCopy = urls.join("\n");

    // 使用 Clipboard API 复制到剪贴板
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log("success！");
      })
      .catch((err) => {
        console.error("error：", err);
      });
  });

  // 导出功能
  exportButton.addEventListener("click", () => {
    const urls = [];
    document.querySelectorAll("#resource-list li").forEach((li) => {
      urls.push(li.textContent);
    });

    if (urls.length === 0) {
      return;
    }

    // 拼接所有 URL 为多行文本
    const textToExport = urls.join("\n");

    // 创建 Blob 对象
    const blob = new Blob([textToExport], { type: "text/plain" });
    const blobUrl = URL.createObjectURL(blob);

    // 使用 Chrome 的下载 API 保存文件，允许用户选择路径
    chrome.downloads.download({
      url: blobUrl,
      filename: `${currentHostname}_urls.txt`, // 文件名为当前域名
      saveAs: true, 
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("error", chrome.runtime.lastError);
      }
    });
  });
});
