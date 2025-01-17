chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
    chrome.storage.local.get(['enabled', 'redirectUrl'], function (data) {
      if (!data.enabled) {
        console.log('Redirect disabled.');
        return;
      }
  
      const redirectTo = data.redirectUrl || 'https://youtube.com';
  
      try {
        const url = new URL(details.url);
  
        // Check if the URL contains "/shorts/"
        if (url.pathname.startsWith('/shorts/')) {
          const videoId = url.pathname.split('/shorts/')[1];
          console.log('Detected YouTube Shorts:', details.url);
  
          // Redirect logic
          const newUrl = redirectTo.includes('youtube.com')
            ? `https://www.youtube.com/watch?v=xvFZjo5PgG0&pp=ygUJcmljayByb2xs`
            : redirectTo;
  
          console.log('Redirecting to:', newUrl);
  
          chrome.tabs.update(details.tabId, { url: newUrl });
        }
      } catch (error) {
        console.error('Error processing URL:', error);
      }
    });
  }, {
    url: [{ hostContains: 'youtube.com' }]
  });


  let clickTimeout;
const clickDelay = 300; // Time window to detect double-click in milliseconds

chrome.action.onClicked.addListener((tab) => {
  if (clickTimeout) {
    // Double-click detected
    clearTimeout(clickTimeout);
    clickTimeout = null;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showHiddenMessage
    });
  } else {
    // Single click detected, set up timeout to detect double-click
    clickTimeout = setTimeout(() => {
      clickTimeout = null;
      // Handle single click action if needed
    }, clickDelay);
  }
});

function showHiddenMessage() {
  alert('Your hidden message here');
}

  