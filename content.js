// Function to hide Shorts elements from the page
function hideShorts() {
    // Hide Shorts from the homepage
    const shortsSections = document.querySelectorAll('ytd-rich-section-renderer');
    shortsSections.forEach((section) => {
      const title = section.querySelector('h2');
      if (title && title.innerText.toLowerCase().includes('shorts')) {
        section.style.display = 'none';
      }
    });
  
    // Hide Shorts from the sidebar
    const shortsGuide = document.querySelector('ytd-guide-entry-renderer a[title="Shorts"]');
    if (shortsGuide) {
      const guideEntry = shortsGuide.closest('ytd-guide-entry-renderer');
      if (guideEntry) {
        guideEntry.style.display = 'none';
      }
    }
  
    // Hide Shorts from search results and recommendations
    document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer').forEach((video) => {
      const link = video.querySelector('a#thumbnail');
      if (link && link.href.includes('/shorts/')) {
        video.style.display = 'none';
      }
    });
  
    // Hide Shorts sections in user channels
    const shortsInChannel = document.querySelectorAll('a[href*="/shorts"]');
    shortsInChannel.forEach((shortsLink) => {
      const parent = shortsLink.closest('ytd-grid-video-renderer, ytd-rich-section-renderer, ytd-thumbnail');
      if (parent) {
        parent.style.display = 'none';
      }
    });
  }
  
  // Function to redirect if the current URL is a Shorts URL
  function redirectIfShorts() {
    chrome.storage.local.get(['enabled', 'redirectUrl'], (data) => {
      if (!data.enabled) return;
  
      const currentUrl = location.href;
      if (currentUrl.includes('/shorts/')) {
        const videoId = currentUrl.split('/shorts/')[1];
        const redirectTo = data.redirectUrl || 'https://www.youtube.com';
  
        // Redirect logic
        const newUrl = redirectTo.includes('youtube.com')
          ? `https://www.youtube.com/watch?v=${videoId}`
          : redirectTo;
  
        window.location.href = newUrl; // Redirect to the desired URL
      }
    });
  }
  
  // Initialize the script
  chrome.storage.local.get(['enabled'], (data) => {
    if (data.enabled) {
      hideShorts();
      redirectIfShorts();
  
      // Observe changes in the DOM to handle dynamically loaded content
      const observer = new MutationObserver(() => {
        hideShorts();
        redirectIfShorts();
      });
      observer.observe(document.body, { childList: true, subtree: true });
  
      // Listen for URL changes in single-page applications
      history.pushState = ((f) =>
        function pushState() {
          const ret = f.apply(this, arguments);
          window.dispatchEvent(new Event('locationchange'));
          return ret;
        })(history.pushState);
  
      history.replaceState = ((f) =>
        function replaceState() {
          const ret = f.apply(this, arguments);
          window.dispatchEvent(new Event('locationchange'));
          return ret;
        })(history.replaceState);
  
      window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'));
      });
  
      window.addEventListener('locationchange', () => {
        redirectIfShorts();
      });
    }
  });
  