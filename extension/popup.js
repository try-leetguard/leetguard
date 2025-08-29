// Popup state variables
let completedToday = 3; // Placeholder
let goalQuestions = 5; // Placeholder
let countdownInterval;

// Guest mode variables
let isGuestMode = false;
let guestProgress = {
  target_daily: 1,
  progress_today: 0,
  progress_date: null,
  last_reset: null
};

// Import auth functionality - these will be available globally
// since they're loaded in the background script and shared storage

function updateTimeDisplay() {
  document.getElementById('timeDisplay').textContent = currentTime;
}

function startCountdown() {
  console.log('Popup: Starting countdown with', currentTime, 'minutes');
  remainingTime = currentTime * 60; // Convert to seconds
  console.log('Popup: Remaining time in seconds:', remainingTime);
  saveCountdownState();
  showCountdownPopup();
  
  // Send message to background script to start timer
  console.log('Popup: Sending START_COUNTDOWN message to background');
  chrome.runtime.sendMessage({
    type: 'START_COUNTDOWN',
    remainingTime: remainingTime,
    currentTime: currentTime
  }).then(() => {
    console.log('Popup: START_COUNTDOWN message sent successfully');
  }).catch(err => {
    console.error('Popup: Failed to send START_COUNTDOWN message:', err);
  });
}

function updateCountdownDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const countdownDisplay = document.getElementById('countdownDisplay');
  if (countdownDisplay) {
    countdownDisplay.textContent = timeString;
  }
}

function saveCountdownState() {
  chrome.storage.local.set({
    countdownActive: true,
    remainingTime: remainingTime,
    isPaused: isPaused,
    currentTime: currentTime
  });
}

function clearCountdownState() {
  chrome.storage.local.remove(['countdownActive', 'remainingTime', 'isPaused']);
}

function loadCountdownState() {
  chrome.storage.local.get(['countdownActive', 'remainingTime', 'isPaused', 'currentTime'], (data) => {
    if (data.countdownActive && data.remainingTime > 0) {
      console.log('Loading countdown state:', data);
      // Restore countdown state
      remainingTime = data.remainingTime;
      isPaused = data.isPaused;
      if (data.currentTime) currentTime = data.currentTime;
      
      // Show countdown popup
      showCountdownPopup();
      
      // Set up periodic refresh from storage
      setInterval(() => {
        chrome.storage.local.get(['remainingTime', 'isPaused'], (storageData) => {
          if (storageData.remainingTime !== undefined) {
            remainingTime = storageData.remainingTime;
            isPaused = storageData.isPaused;
            updateCountdownDisplay();
            
            // Update pause button text
            const pauseBtn = document.getElementById('pauseBtn');
            if (pauseBtn) {
              pauseBtn.textContent = isPaused ? 'RESUME' : 'PAUSE';
            }
          }
        });
      }, 1000);
    }
  });
}

function showCountdownPopup() {
  console.log('Showing countdown in existing popup...');
  
  // Modify the existing popup content
  const mainPopup = document.getElementById('leetguard-popup');
  if (mainPopup) {
    mainPopup.innerHTML = `
      <div class="countdown-content">
        <h3><img src="icons/leetguard-logo-black.png" alt="LeetGuard" class="logo"> FOCUS TIMER</h3>
        <div class="countdown-timer" id="countdownDisplay">${Math.floor(remainingTime / 60).toString().padStart(2, '0')}:${(remainingTime % 60).toString().padStart(2, '0')}</div>
        <div class="countdown-buttons">
          <button id="pauseBtn">${isPaused ? 'RESUME' : 'PAUSE'}</button>
          <button id="resetBtn">RESET</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    if (pauseBtn) {
      pauseBtn.addEventListener('click', togglePause);
      console.log('Pause button listener added');
    }
    
    if (resetBtn) {
      resetBtn.addEventListener('click', resetTimer);
      console.log('Reset button listener added');
    }
  }
}

function togglePause() {
  isPaused = !isPaused;
  const pauseBtn = document.getElementById('pauseBtn');
  pauseBtn.textContent = isPaused ? 'RESUME' : 'PAUSE';
  saveCountdownState();
  
  // Notify background script of pause state
  chrome.runtime.sendMessage({
    type: 'TOGGLE_PAUSE',
    isPaused: isPaused
  });
}

function resetTimer() {
  isPaused = false;
  clearCountdownState();
  
  // Notify background script to stop timer
  chrome.runtime.sendMessage({ type: 'RESET_TIMER' });
  
  // Restore original popup content
  const mainPopup = document.getElementById('leetguard-popup');
  if (mainPopup) {
    mainPopup.innerHTML = `
      <div class="timer-section">
        <h3><img src="icons/leetguard-logo-black.png" alt="LeetGuard" class="logo"> TIMER</h3>
        <div class="time-setter">
          <button class="time-btn" id="decreaseTime">-</button>
          <span id="timeDisplay">${currentTime}</span>
          <button class="time-btn" id="increaseTime">+</button>
        </div>
        <span class="time-unit">minutes</span>
      </div>
      <div class="button-group">
        <button id="toggleFocus">Focus</button>
        <button id="editList">Edit List</button>
      </div>
    `;
    
    // Re-add event listeners for the original buttons
    document.getElementById('toggleFocus').addEventListener('click', () => {
      chrome.storage.local.get('focusMode', (data) => {
        const newMode = !data.focusMode;
        chrome.storage.local.set({ focusMode: newMode });
        chrome.runtime.sendMessage({ type: 'FOCUS_MODE_TOGGLE', focusMode: newMode });
        
        // Start countdown immediately when button is clicked
        startCountdown();
      });
    });
    
    document.getElementById('increaseTime').addEventListener('click', () => {
      currentTime += 5;
      updateTimeDisplay();
    });
    
    document.getElementById('decreaseTime').addEventListener('click', () => {
      if (currentTime > 5) {
        currentTime -= 5;
        updateTimeDisplay();
      }
    });
    
    document.getElementById('editList').addEventListener('click', () => {
      // Check if user is authenticated
      if (typeof extensionAuth !== 'undefined' && extensionAuth.isAuthenticated()) {
        // User is logged in, redirect to web app blocklist page
        // Get the web app URL - use localhost for development, production URL for production
        const webAppUrl = 'http://localhost:3000'; // TODO: Make this configurable for production
        chrome.tabs.create({
          url: `${webAppUrl}/blocklist`
        });
      } else {
        // User is not logged in, show mini blocklist UI
        console.log('Edit List clicked - showing mini blocklist UI');
        showMiniBlocklistUI();
      }
    });
    
    updateTimeDisplay();
  }
}

function showTimerComplete() {
  const mainPopup = document.getElementById('leetguard-popup');
  if (mainPopup) {
    mainPopup.innerHTML = `
      <div class="countdown-content">
        <h3>TIMER COMPLETE!</h3>
        <div class="countdown-message">Great job staying focused!</div>
        <button id="resetBtn">BACK TO MENU</button>
      </div>
    `;
    
    document.getElementById('resetBtn').addEventListener('click', resetTimer);
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
  console.log('Popup received message:', message);
  
  if (message.type === 'TIMER_UPDATE') {
    console.log('Updating timer display:', message.remainingTime);
    remainingTime = message.remainingTime;
    updateCountdownDisplay();
  } else if (message.type === 'TIMER_COMPLETE') {
    console.log('Timer completed');
    showTimerComplete();
    clearCountdownState();
  } else if (message.type === 'PROBLEM_COMPLETED') {
    console.log('Problem completed:', message);
    
    // Handle problem completion for both guest and authenticated modes
    if (isGuestMode) {
      incrementGuestProgress();
    } else {
      // For authenticated users, this will be handled by the activity logger
      console.log('Problem completion handled by activity logger for authenticated user');
    }
  }
});

// Initialize popup with new activity-focused logic
async function initializePopup() {
  // Always check extension storage for current auth state when popup opens
  if (typeof extensionAuth !== 'undefined') {
    await extensionAuth.init();
  }
  
  // Check if user is authenticated or in guest mode
  if (typeof extensionAuth !== 'undefined' && extensionAuth.isAuthenticated()) {
    console.log('User is authenticated, initializing authenticated mode');
    isGuestMode = false;
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Update UI based on current auth state
    await updateAuthUI();
    
    // Initialize progress display (placeholder for now)
    updateProgressDisplay();
    
    // Initialize countdown
    initializeCountdown();
    
    // Sync data if user is authenticated
    try {
      console.log('Popup: Running on-demand sync...');
      
      // Sync blocklist and activities
      if (typeof blocklistSync !== 'undefined') {
        await blocklistSync.syncBlocklist();
      }
      
      if (typeof activityLogger !== 'undefined') {
        await activityLogger.syncPendingActivities();
      }
      
      console.log('Popup: On-demand sync completed');
    } catch (error) {
      console.error('Popup: On-demand sync failed:', error);
      
      // If sync fails due to authentication error, clear auth and update UI
      if (error.message === 'Authentication expired') {
        console.log('Popup: Authentication expired during sync, clearing auth state');
        await extensionAuth.clearAuth();
        updateAuthUI();
      }
    }
  } else {
    console.log('User is not authenticated, initializing guest mode');
    // Initialize guest mode
    await initializeGuestMode();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize progress display
    updateProgressDisplay();
    
    // Initialize countdown
    initializeCountdown();
  }
}

// Initialize event listeners for new UI
function initializeEventListeners() {
  const editBlocklistBtn = document.getElementById('editBlocklist');
  const extensionToggle = document.getElementById('extensionToggle');

  if (editBlocklistBtn) {
    editBlocklistBtn.addEventListener('click', async () => {
      // Always check extension storage for current auth state when button is clicked
      if (typeof extensionAuth !== 'undefined') {
        await extensionAuth.init();
      }
      
      // Check if user is authenticated
      if (typeof extensionAuth !== 'undefined' && extensionAuth.isAuthenticated()) {
        // User is logged in, redirect to web app blocklist page
        const webAppUrl = 'http://localhost:3000'; // TODO: Make this configurable for production
        chrome.tabs.create({
          url: `${webAppUrl}/blocklist`
        });
      } else {
        // User is not logged in, show mini blocklist UI
        console.log('Edit Blocklist clicked - showing mini blocklist UI');
        showMiniBlocklistUI();
      }
    });
  }

  if (extensionToggle) {
    extensionToggle.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      
      // Redirect to activity page for extension control
      const webAppUrl = 'http://localhost:3000'; // TODO: Make this configurable for production
      chrome.tabs.create({
        url: `${webAppUrl}/activity`
      });
      
      // Reset toggle state since we're redirecting
      setTimeout(() => {
        e.target.checked = !enabled;
      }, 100);
    });
  }
}

// Update progress display (placeholder for now)
function updateProgressDisplay() {
  const percentage = Math.round((completedToday / goalQuestions) * 100);
  
  const progressText = document.getElementById('progressText');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressMessage = document.getElementById('progressMessage');
  
  if (progressText) {
    progressText.textContent = `${completedToday} / ${goalQuestions}`;
  }
  
  if (progressBarFill) {
    // Update the progress bar fill width
    progressBarFill.style.width = `${percentage}%`;
  }
  
  if (progressMessage) {
    const remaining = Math.max(goalQuestions - completedToday, 0);
    if (completedToday >= goalQuestions) {
      progressMessage.textContent = "🎉 Daily goal completed! Enjoy your scroll.";
    } else {
      progressMessage.textContent = `Complete ${remaining} more questions to unlock.`;
    }
  }
  
  // Log current state for debugging
  console.log('Progress display updated:', {
    completedToday,
    goalQuestions,
    percentage,
    isGuestMode
  });
}

// Initialize countdown display
function initializeCountdown() {
  const nextUtcMidnight = () => {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = now.getUTCMonth();
    const d = now.getUTCDate();
    return new Date(Date.UTC(y, m, d + 1, 0, 0, 0, 0));
  };

  const formatHMS = (ms) => {
    if (ms <= 0) return "00:00:00";
    const totalSec = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const updateCountdown = () => {
    const deadline = nextUtcMidnight();
    const now = new Date();
    const remaining = deadline.getTime() - now.getTime();
    
    const countdownDisplay = document.getElementById('countdownDisplay');
    if (countdownDisplay) {
      countdownDisplay.textContent = formatHMS(remaining);
    }
  };

  // Update immediately and then every second
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

// Update UI based on authentication state
async function updateAuthUI() {
  // Always check extension storage for current auth state
  if (typeof extensionAuth !== 'undefined') {
    await extensionAuth.init();
  }
  
  // If user is authenticated and we're showing the mini blocklist UI, switch to main UI
  if (typeof extensionAuth !== 'undefined' && extensionAuth.isAuthenticated()) {
    const miniBlocklist = document.querySelector('.mini-blocklist');
    if (miniBlocklist) {
      console.log('User authenticated, switching from mini blocklist to main UI');
      restoreMainUI();
    }
  }
}

// Show mini blocklist UI (keep existing logic)
function showMiniBlocklistUI() {
  const mainPopup = document.getElementById('leetguard-popup');
  if (mainPopup) {
    mainPopup.innerHTML = `
      <div class="mini-blocklist">
        <div class="mini-header">
          <button id="backArrowBtn" class="back-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="header-content">
            <img src="icons/leetguard-logo-black.png" alt="LeetGuard" class="logo">
            <h3>Blocklist Settings</h3>
          </div>
        </div>
        
        <div class="current-sites">
          <h4>Currently Blocked Sites:</h4>
          <div class="site-list">
            <div class="site-item">
              <svg class="site-icon facebook-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              facebook.com
            </div>
            <div class="site-item">
              <svg class="site-icon reddit-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
              reddit.com
            </div>
            <div class="site-item">
              <svg class="site-icon youtube-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              youtube.com
            </div>
            <div class="site-item">
              <svg class="site-icon instagram-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              instagram.com
            </div>
            <div class="site-item">
              <svg class="site-icon twitter-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              x.com
            </div>
          </div>
        </div>
        
        <div class="upgrade-info">
          <h4>Want to customize?</h4>
          <p>Sign in to add your own distracting sites and sync across devices</p>
        </div>
        
        <div class="mini-actions">
          <button id="signInBtn" class="primary-btn">Login to Customize</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('signInBtn').addEventListener('click', () => {
      const webAppUrl = 'http://localhost:3000'; // TODO: Make this configurable for production
      chrome.tabs.create({
        url: `${webAppUrl}/login?redirect=extension`
      });
    });
    
    document.getElementById('backArrowBtn').addEventListener('click', () => {
      restoreMainUI();
    });
  }
}

// Restore main UI (keep existing logic)
function restoreMainUI() {
  const mainPopup = document.getElementById('leetguard-popup');
  if (mainPopup) {
    // Determine button text and label based on guest mode
    const buttonText = isGuestMode ? 'Login' : 'Edit';
    const controlLabel = isGuestMode ? 'Customize Blocklist' : 'Edit Blocklist';
    
    mainPopup.innerHTML = `
      <!-- Top Section - Full Width -->
      <div class="activity-section">
        <div class="activity-header">
          <div class="header-content">
            <img src="icons/leetguard-logo-black.png" alt="LeetGuard" class="logo">
            <h3>MY ACTIVITY</h3>
          </div>
        </div>
        
        <div class="progress-section">
          <div class="progress-header">
            <h3 class="progress-title">Today's Progress</h3>
            <span class="countdown-text" id="countdownDisplay">23:45:12</span>
          </div>
          <div class="progress-display">
            <div class="progress-stats">
              <span class="progress-label">Questions Completed</span>
              <span class="progress-text" id="progressText">0 / 5</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" id="progressBarFill"></div>
            </div>
            <div class="progress-message" id="progressMessage">
              Complete 5 more questions to unlock.
            </div>
          </div>
        </div>
        
        <div class="controls-section">
          <!-- Left Half -->
          <div class="control-left">
            <div class="control-label">${controlLabel}</div>
            <button id="editBlocklist" class="control-button">
              ${buttonText}
            </button>
          </div>
          
          <!-- Right Half -->
          <div class="control-right">
            <div class="control-label">Extension Control</div>
            <div class="toggle-container">
              <input type="checkbox" id="extensionToggle" class="toggle-switch">
              <label for="extensionToggle" class="toggle-label"></label>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Re-add event listeners
    initializeEventListeners();
    
    // Re-initialize displays
    updateProgressDisplay();
    initializeCountdown();
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    initializePopup();
  } catch (error) {
    console.error('Failed to initialize popup:', error);
    // Fallback: just initialize event listeners
    initializeEventListeners();
    updateProgressDisplay();
    initializeCountdown();
  }
});

// Clean up interval when popup closes
window.addEventListener('beforeunload', () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
}); 

// Guest mode functions
async function initializeGuestMode() {
  console.log('Initializing guest mode...');
  
  // Load guest progress from storage
  const result = await chrome.storage.local.get(['guest_progress']);
  if (result.guest_progress) {
    guestProgress = result.guest_progress;
    console.log('Loaded guest progress:', guestProgress);
  } else {
    // Initialize new guest progress
    guestProgress = {
      target_daily: 1,
      progress_today: 0,
      progress_date: new Date().toISOString().split('T')[0], // UTC date string
      last_reset: Date.now()
    };
    await chrome.storage.local.set({ guest_progress: guestProgress });
    console.log('Initialized new guest progress:', guestProgress);
  }
  
  // Check if we need to reset progress for new day
  await checkAndResetGuestProgress();
  
  // Update UI variables
  completedToday = guestProgress.progress_today;
  goalQuestions = guestProgress.target_daily;
  isGuestMode = true;
}

async function checkAndResetGuestProgress() {
  const today = new Date().toISOString().split('T')[0]; // UTC date string
  
  if (guestProgress.progress_date !== today) {
    console.log('New day detected, resetting guest progress');
    guestProgress.progress_today = 0;
    guestProgress.progress_date = today;
    guestProgress.last_reset = Date.now();
    
    await chrome.storage.local.set({ guest_progress: guestProgress });
    
    // Update UI variables
    completedToday = 0;
  }
}

async function incrementGuestProgress() {
  await checkAndResetGuestProgress();
  
  guestProgress.progress_today += 1;
  completedToday = guestProgress.progress_today;
  
  await chrome.storage.local.set({ guest_progress: guestProgress });
  
  // Update UI
  updateProgressDisplay();
  
  console.log('Guest progress incremented:', guestProgress.progress_today);
  
  // Check if goal is completed
  if (guestProgress.progress_today >= guestProgress.target_daily) {
    console.log('Guest daily goal completed!');
    // TODO: Disable blocking when goal is completed
  }
} 