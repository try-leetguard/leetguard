// LeetGuard Content Script for LeetCode pages
console.log('🎯 LeetGuard Content Script loaded');

// Listen for messages from web app
window.addEventListener('message', (event) => {
  if (event.data?.type === 'EXTENSION_TOGGLE') {
    console.log('Content script received toggle message from web app:', event.data.enabled);
    // Forward to background script
    chrome.runtime.sendMessage({
      type: 'EXTENSION_TOGGLE',
      enabled: event.data.enabled
    }).catch(error => {
      console.error('Failed to forward toggle message to background:', error);
    });
  } else if (event.data?.type === 'REQUEST_TOGGLE_STATE') {
    console.log('Content script received toggle state request from web app');
    // Get current state from storage and send back
    chrome.storage.local.get(['extension_blocking_enabled'], (result) => {
      const enabled = result.extension_blocking_enabled !== false; // Default to true
      window.postMessage({
        type: 'TOGGLE_STATE_CHANGED',
        enabled: enabled
      }, '*');
      console.log('Content script sent current toggle state to web app:', enabled);
    });
  }
});

// Listen for storage changes from extension
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.extension_blocking_enabled) {
    const enabled = changes.extension_blocking_enabled.newValue !== false; // Default to true
    console.log('Content script detected storage change:', enabled);
    // Notify web app of state change
    window.postMessage({
      type: 'TOGGLE_STATE_CHANGED',
      enabled: enabled
    }, '*');
  }
});

// Note: localStorage monitoring removed - extension now checks localStorage on-demand

// Inject script file into page context
const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected.js');
script.onload = function() {
  this.remove();
};
script.onerror = function() {
  console.error("❌ Failed to load injected script");
};
document.documentElement.appendChild(script);

// Inject CSS for popup if not already present
function injectLeetGuardPopupCSS() {
  if (!document.getElementById('leetguard-popup-style')) {
    const style = document.createElement('link');
    style.id = 'leetguard-popup-style';
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = chrome.runtime.getURL('styles.css');
    document.head.appendChild(style);
  }
}

function cleanProblemTitle(title) {
  return (title || '').replace(/^\s*\d+\.\s*/, '').trim();
}

function titleizeProblemSlug(problemSlug) {
  return (problemSlug || 'Unknown Problem')
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getProblemDisplayName(problemSlug) {
  const titleElement = document.querySelector('[data-cy="question-title"]');
  const pageTitle = cleanProblemTitle(titleElement?.textContent);
  if (pageTitle) {
    return pageTitle;
  }

  const documentProblemTitle = cleanProblemTitle(
    document.title.split(' - ')[0]
  );
  if (documentProblemTitle && documentProblemTitle !== 'LeetCode') {
    return documentProblemTitle;
  }

  return titleizeProblemSlug(problemSlug);
}

const leetGuardShownSubmissionPopups = new Set();

function createLeetGuardCheckIcon() {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('class', 'check-icon');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('aria-hidden', 'true');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M20 6 9 17l-5-5');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-width', '3');
  icon.appendChild(path);

  return icon;
}

function createLeetGuardLogoImage() {
  const logo = document.createElement('img');
  logo.className = 'brand-logo';
  logo.src = chrome.runtime.getURL('icons/leetguard-logo-black.png');
  logo.alt = '';

  return logo;
}

function createLeetGuardConfetti() {
  const confetti = document.createElement('div');
  confetti.className = 'confetti';
  confetti.setAttribute('aria-hidden', 'true');

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return confetti;
  }

  const colors = ['#22c55e', '#16a34a', '#111827', '#9ca3af', '#f59e0b'];

  Array.from({ length: 22 }).forEach((_, index) => {
    const particle = document.createElement('span');
    const angle = (Math.PI * 2 * index) / 22;
    const distance = 58 + Math.random() * 54;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance - 8;

    particle.style.setProperty('--x', `${x.toFixed(1)}px`);
    particle.style.setProperty('--y', `${y.toFixed(1)}px`);
    particle.style.setProperty('--r', `${Math.round(Math.random() * 260 - 130)}deg`);
    particle.style.setProperty('--delay', `${Math.round(Math.random() * 90)}ms`);
    particle.style.setProperty('--bg', colors[index % colors.length]);
    particle.style.setProperty('--w', `${Math.round(4 + Math.random() * 4)}px`);
    particle.style.setProperty('--h', `${Math.round(8 + Math.random() * 6)}px`);

    confetti.appendChild(particle);
  });

  return confetti;
}

// Popup function to show when a problem is solved
function showLeetGuardPopup(problemName) {
  console.log("[LeetGuard] Showing solve toast for:", problemName);
  
  injectLeetGuardPopupCSS();
  
  // Remove existing popup if present
  const existing = document.getElementById('leetguard-congrats-popup');
  if (existing) {
    existing.remove();
  }

  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'leetguard-congrats-popup';
  popup.setAttribute('role', 'status');
  popup.setAttribute('aria-live', 'polite');

  const statusBadge = document.createElement('span');
  statusBadge.className = 'status-badge';
  statusBadge.appendChild(createLeetGuardCheckIcon());

  const message = document.createElement('span');
  message.className = 'message';

  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = 'Solved';

  const title = document.createElement('strong');
  title.className = 'problem-title';
  title.textContent = problemName;
  message.append(label, title);

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'close-btn';
  closeButton.setAttribute('aria-label', 'Dismiss solve notification');
  closeButton.textContent = '×';
  popup.append(createLeetGuardConfetti(), statusBadge, message, closeButton);

  let phaseTimer;
  let dismissTimer;
  const dismissPopup = () => {
    clearTimeout(phaseTimer);
    clearTimeout(dismissTimer);
    popup.remove();
  };

  // Add close event
  closeButton.onclick = dismissPopup;

  document.body.appendChild(popup);

  phaseTimer = setTimeout(() => {
    if (!popup.isConnected) {
      return;
    }

    popup.classList.add('is-progress-update');
    statusBadge.replaceChildren(createLeetGuardLogoImage());
    label.textContent = 'LeetGuard';
    title.textContent = 'Progress updated';
    closeButton.setAttribute('aria-label', 'Dismiss LeetGuard notification');
  }, 1500);

  // Auto-remove after the branded follow-up has had time to read.
  dismissTimer = setTimeout(dismissPopup, 5200);
}

// Listen for messages from the injected script
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data && event.data.source === "leetguard-injected") {
    console.log("Content script received message:", event.data);
    
    // Handle submission POST request
    if (event.data.type === "submission") {
      // Extract submission ID from response
      const submissionId = event.data.responseData?.submission_id;
      if (submissionId) {
        console.log("🆔 Submission ID:", submissionId);
      }
    }
    
    // Handle status check responses
    if (event.data.type === "status_check") {
      const statusData = event.data.responseData;
      console.log("📊 Status check response:", statusData);
      
      // Check if this is a real submission (not a test run)
      const submissionId = statusData?.submission_id ? String(statusData.submission_id) : '';

      if (statusData && 
          statusData.status_code === 10 && 
          statusData.task_name === "judger.judgetask.Judge" &&
          statusData.question_id &&
          statusData.finished === true &&
          submissionId &&
          !submissionId.startsWith("runcode_")) {
        
        console.log("✅ Real submission ACCEPTED!");
        
        // Extract problem info from URL
        const urlParts = window.location.pathname.split('/');
        const problemSlug = urlParts[2]; // /problems/two-sum/...
        const problemName = getProblemDisplayName(problemSlug);
        
        console.log(`[LeetGuard] Problem "${problemName}" solved successfully.`);
        
        // Show popup
        if (!leetGuardShownSubmissionPopups.has(submissionId)) {
          leetGuardShownSubmissionPopups.add(submissionId);
          showLeetGuardPopup(problemName);
        }
        
        // Extract additional problem info from the page
        const difficultyElement = document.querySelector('[diff]');
        
        const problemInfo = {
          problemSlug,
          url: window.location.href,
          problem_name: problemName,
          difficulty: difficultyElement?.getAttribute('diff') || 'Unknown',
          timestamp: Date.now()
        };
        
        // Send message to background script (guard against invalidated context after extension reload)
        if (chrome.runtime && chrome.runtime.id) {
          try {
            chrome.runtime.sendMessage({
              type: "SUBMISSION_ACCEPTED",
              slug: problemSlug,
              submissionId,
              timestamp: Date.now(),
              url: window.location.href,
              statusData: statusData,
              problemInfo: problemInfo
            }).catch(() => {
              console.log("[LeetGuard] Extension context invalidated. Please refresh the page.");
            });
          } catch (err) {
            console.log("[LeetGuard] Extension context invalidated. Please refresh the page.");
          }
        } else {
          console.log("[LeetGuard] Connection to extension lost.");
        }
      } else if (statusData && statusData.status_code === 10) {
        console.log("🧪 Test run detected (not a real submission)");
        console.log("Task name:", statusData.task_name);
        console.log("Submission ID:", statusData.submission_id);
      }
    }
  }
});

// Handle OAuth callback from web app
if (window.location.href.includes('extension-auth-callback')) {
  // Extract tokens from URL parameters or postMessage
  window.addEventListener('message', (event) => {
    if (event.origin !== 'http://localhost:3000') return;
    
    if (event.data.type === 'OAUTH_SUCCESS' && event.data.tokens) {
      // Send tokens to background script
      chrome.runtime.sendMessage({
        type: 'OAUTH_CALLBACK',
        tokens: event.data.tokens
      });
    }
  });
}

// Web app data/auth sync is handled exclusively by webapp-detector.js on the
// dashboard origin. This script only forwards extension toggle messages above.
