/**
 * Profile Card Component - HNG Frontend Task
 * 
 * Features:
 * - Displays current epoch time in milliseconds
 * - Updates every 500ms for smooth display
 * - Accessible with aria-live announcements
 * - Fully responsive
 */

// DOM Elements
let timeDisplayElement;
let liveRegion;

// Store the current time for comparison (optional)
let lastAnnouncedTime = '';

/**
 * Get current epoch time in milliseconds
 * @returns {string} Current timestamp in milliseconds
 */
function getCurrentEpochTime() {
    return Date.now().toString();
}

/**
 * Format milliseconds with thousands separator for better readability
 * @param {string} ms - Milliseconds string
 * @returns {string} Formatted milliseconds
 */
function formatMilliseconds(ms) {
    // Add thousands separator for readability (optional, but nice)
    return parseInt(ms).toLocaleString('en-US');
}

/**
 * Update the time display
 * Updates every 500ms to ensure accurate millisecond display
 */
function updateTimeDisplay() {
    if (!timeDisplayElement) return;
    
    const epochTime = getCurrentEpochTime();
    const formattedTime = formatMilliseconds(epochTime);
    
    // Update the display
    timeDisplayElement.textContent = formattedTime;
    timeDisplayElement.setAttribute('aria-label', `Current epoch time: ${formattedTime} milliseconds`);
    
    // Announce significant changes to screen readers (every 5 seconds to avoid spam)
    // Only announce when the last 3 digits change significantly
    const lastThreeDigits = epochTime.slice(-3);
    const lastAnnouncedThreeDigits = lastAnnouncedTime.slice(-3);
    
    if (Math.abs(parseInt(lastThreeDigits) - parseInt(lastAnnouncedThreeDigits)) > 100) {
        if (liveRegion && lastAnnouncedTime) {
            liveRegion.textContent = `Time updated: ${formattedTime} milliseconds since January 1, 1970`;
            setTimeout(() => {
                if (liveRegion) liveRegion.textContent = '';
            }, 2000);
        }
        lastAnnouncedTime = epochTime;
    }
}

/**
 * Handle keyboard navigation for social links
 * Ensures all links are focusable and accessible
 */
function setupKeyboardNavigation() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        // Add tabindex if needed (already focusable as <a> elements)
        // Ensure proper focus styles are applied via CSS
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });
}

/**
 * Validate all required data-testid elements exist
 * Logs to console for debugging (doesn't affect functionality)
 */
function validateRequiredElements() {
    const requiredTestIds = [
        'test-profile-card',
        'test-user-name',
        'test-user-bio',
        'test-user-time',
        'test-user-avatar',
        'test-user-social-links',
        'test-user-hobbies',
        'test-user-dislikes'
    ];
    
    const missingElements = [];
    
    requiredTestIds.forEach(testId => {
        const element = document.querySelector(`[data-testid="${testId}"]`);
        if (!element) {
            missingElements.push(testId);
        }
    });
    
    if (missingElements.length > 0) {
        console.warn('[Profile Card] Missing required elements:', missingElements);
    } else {
        console.log('[Profile Card] All required elements present ✅');
    }
}

/**
 * Check for individual social link testids
 */
function validateSocialLinks() {
    const expectedSocialLinks = ['linkedin', 'github', 'twitter', 'email'];
    const presentLinks = [];
    
    expectedSocialLinks.forEach(social => {
        const link = document.querySelector(`[data-testid="test-user-social-${social}"]`);
        if (link) {
            presentLinks.push(social);
        }
    });
    
    console.log('[Profile Card] Social links present:', presentLinks);
    return presentLinks;
}

/**
 * Initialize the Profile Card
 */
function init() {
    // Get DOM elements
    timeDisplayElement = document.getElementById('current-time');
    liveRegion = document.getElementById('live-region');
    
    if (!timeDisplayElement) {
        console.error('[Profile Card] Time display element not found');
        return;
    }
    
    // Initial time update
    updateTimeDisplay();
    
    // Update time every 500ms for accurate millisecond display
    // This ensures the time is always current when viewed
    const timeInterval = setInterval(updateTimeDisplay, 500);
    
    // Set up keyboard navigation
    setupKeyboardNavigation();
    
    // Validate all required elements (for debugging)
    validateRequiredElements();
    validateSocialLinks();
    
    // Log initialization
    console.log('[Profile Card] Initialized at:', new Date().toISOString());
    console.log('[Profile Card] Current epoch time:', getCurrentEpochTime());
    
    // Clean up interval on page unload (optional, but good practice)
    window.addEventListener('beforeunload', () => {
        clearInterval(timeInterval);
    });
}

// Start the application when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}