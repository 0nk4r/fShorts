document.addEventListener('DOMContentLoaded', function() {
    const mainToggle = document.getElementById('mainToggle');
    const redirectUrl = document.getElementById('redirectUrl');
    const saveButton = document.getElementById('saveButton');
    const message = document.getElementById('message');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
  
    chrome.storage.local.get(['enabled', 'redirectUrl'], function(data) {
      // Set initial toggle state with explicit default to false
      const isEnabled = data.enabled !== undefined ? data.enabled : false;
      mainToggle.checked = isEnabled;
      updateStatusIndicator(isEnabled);
      
      // Set redirect URL
      redirectUrl.value = data.redirectUrl || 'https://youtube.com';
    });
  
    function updateStatusIndicator(enabled) {
      statusDot.className = 'status-indicator ' + (enabled ? 'status-active' : 'status-inactive');
      statusText.textContent = enabled ? 'Blocking Enabled' : 'Blocking Disabled';
    }
  
    // Save settings
    saveButton.addEventListener('click', function() {
      const url = redirectUrl.value.trim();
      
      try {
        new URL(url);
        
        chrome.storage.local.set({
          redirectUrl: url
        }, function() {
          showMessage('Settings saved successfully!', 'success');
        });
      } catch (e) {
        showMessage('Please enter a valid URL', 'error');
      }
    });
  
    // Toggle enable/disable
    mainToggle.addEventListener('change', function() {
      const isEnabled = mainToggle.checked;
      
      chrome.storage.local.set({
        enabled: isEnabled
      }, function() {
        updateStatusIndicator(isEnabled);
        // Reload active YouTube tabs to apply changes
        chrome.tabs.query({url: "*://*.youtube.com/*"}, function(tabs) {
          tabs.forEach(tab => {
            chrome.tabs.reload(tab.id);
          });
        });
      });
    });
  
    function showMessage(text, type) {
      message.textContent = text;
      message.className = 'message ' + type;
      setTimeout(() => {
        message.className = 'message';
      }, 3000);
    }
  });