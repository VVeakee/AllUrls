let resourceUrls = [];
const blacklist = ["colorfulclouds.net", "hm.baidu.com"]; // 黑名单域名

chrome.webRequest.onCompleted.addListener(
  (details) => {
    const url = new URL(details.url);

    // 检查是否为黑名单域名或其子域
    const isBlacklisted = blacklist.some((blockedDomain) => {
      return url.hostname === blockedDomain || url.hostname.endsWith(`.${blockedDomain}`);
    });

    // 如果不在黑名单中，则记录 URL
    if (
      !details.url.startsWith("chrome-extension://") && !isBlacklisted && !url.hostname.includes("google")
    ) {
      resourceUrls.push(details.url);
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getResources") {
    sendResponse(resourceUrls);
  }
});
