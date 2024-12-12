document.addEventListener("DOMContentLoaded", () => {
  const resourceList = document.getElementById("resource-list");
  const exportButton = document.getElementById("export-button");
  const copyButton = document.getElementById("copy-button");

  let currentHostname = "unknown"; // ���ڱ��浱ǰ����

  // ��ȡ��Դ·������ʾ
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

  // ��ȡ��ǰ��ǩҳ������
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url);
    currentHostname = url.hostname; // ��ȡ����
  });

  // ���ƹ���
  copyButton.addEventListener("click", () => {
    const urls = [];
    document.querySelectorAll("#resource-list li").forEach((li) => {
      urls.push(li.textContent);
    });

    if (urls.length === 0) {
      return;
    }

    // ƴ������ URL Ϊ�����ı�
    const textToCopy = urls.join("\n");

    // ʹ�� Clipboard API ���Ƶ�������
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log("success��");
      })
      .catch((err) => {
        console.error("error��", err);
      });
  });

  // ��������
  exportButton.addEventListener("click", () => {
    const urls = [];
    document.querySelectorAll("#resource-list li").forEach((li) => {
      urls.push(li.textContent);
    });

    if (urls.length === 0) {
      return;
    }

    // ƴ������ URL Ϊ�����ı�
    const textToExport = urls.join("\n");

    // ���� Blob ����
    const blob = new Blob([textToExport], { type: "text/plain" });
    const blobUrl = URL.createObjectURL(blob);

    // ʹ�� Chrome ������ API �����ļ��������û�ѡ��·��
    chrome.downloads.download({
      url: blobUrl,
      filename: `${currentHostname}_urls.txt`, // �ļ���Ϊ��ǰ����
      saveAs: true, 
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("error", chrome.runtime.lastError);
      }
    });
  });
});
