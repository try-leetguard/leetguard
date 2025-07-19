let currentTime = 25; // Default 25 minutes
let remainingTime = 0;
let isPaused = false;

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
      console.log('Edit List clicked');
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
  }
});

document.getElementById('toggleFocus').addEventListener('click', () => {
  chrome.storage.local.get('focusMode', (data) => {
    const newMode = !data.focusMode;
    chrome.storage.local.set({ focusMode: newMode });
    // Notify background to update blocking
    chrome.runtime.sendMessage({ type: 'FOCUS_MODE_TOGGLE', focusMode: newMode });
    
    // Start countdown immediately when button is clicked
    startCountdown();
  });
});

// Timer functionality
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

// Edit List button functionality
document.getElementById('editList').addEventListener('click', () => {
  // TODO: Implement edit list functionality
  console.log('Edit List clicked');
});

// Load countdown state when popup opens
loadCountdownState();
updateTimeDisplay(); 