// --- JAVASCRIPT FOR NAVIGATION ---

const pages = document.querySelectorAll('.page');
let currentPageIndex = 0; 

const navTriggers = document.querySelectorAll('.button, .navigation-arrow');

// --- TEXT-TO-SPEECH (TTS) SETUP ---
// Target the icon element
const readAloudIcons = document.querySelectorAll('.read-aloud-icon'); 
const synth = window.speechSynthesis; 

let ttsEngineReady = false; 

/**
 * Checks if the browser's TTS system is supported and initialized.
 */
function checkTtsReadiness() {
    if (!synth || !('speechSynthesis' in window)) {
        console.error("Text-to-Speech is not supported by this browser.");
        // Visually disable the icons if TTS isn't supported
        readAloudIcons.forEach(icon => {
            icon.classList.add('disabled'); // Add a disabled class for styling
            icon.title = "TTS Not Supported";
        });
        return;
    }

    // Check if voices are immediately available 
    if (synth.getVoices().length > 0) {
        ttsEngineReady = true;
        console.log("TTS engine ready. Voices loaded.");
    } else {
        // If not, listen for the voiceschanged event
        synth.addEventListener('voiceschanged', () => {
            ttsEngineReady = true;
            console.log("TTS engine ready after voiceschanged event.");
        });
    }
}

// Check readiness immediately
checkTtsReadiness();

/**
 * Function to stop any currently speaking narration.
 */
function stopSpeech() {
    if (synth.speaking) {
        synth.cancel();
    }
}

/**
 * Function to read the text content of a specific page.
 * @param {number} pageIndex - The index of the page (1-4) whose text should be read.
 */
function readPage(pageIndex) {
    if (!ttsEngineReady) {
        console.warn("TTS engine not yet ready.");
        return; 
    }

    stopSpeech(); 

    const textElement = document.getElementById(`text-${pageIndex}`);
    if (!textElement) {
        console.error(`Narration text for page ${pageIndex} not found.`);
        return;
    }
    
    const textToRead = textElement.textContent.trim();
    const utterance = new SpeechSynthesisUtterance(textToRead);

    synth.speak(utterance);
}

// Attach the click handler to all Read Aloud icons
readAloudIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        // Only attempt to read if the icon is not disabled
        if (!icon.classList.contains('disabled')) {
            const pageIndex = icon.getAttribute('data-page-index');
            readPage(pageIndex);
        }
    });
});
// --- END TEXT-TO-SPEECH (TTS) SETUP ---


// --- JAVASCRIPT FOR NAVIGATION ---

/**
 * Function to show a specific page and hide all others.
 * @param {number} index - The index of the page to show.
 */
function goToPage(index) {
    stopSpeech(); // Stop speech whenever the page changes!
    
    const newIndex = parseInt(index, 10);
    if (isNaN(newIndex) || newIndex < 0 || newIndex >= pages.length) {
        console.error('Invalid page index:', index);
        return;
    }

    pages[currentPageIndex].classList.remove('active');
    currentPageIndex = newIndex;
    pages[currentPageIndex].classList.add('active');
}

/**
 * Event listener function to handle clicks on navigation elements.
 */
function handleNavigationClick(event) {
    const nextPage = event.currentTarget.getAttribute('data-next-page');
    goToPage(nextPage);
}

// Attach the click handler to all navigation elements
navTriggers.forEach(element => {
    element.addEventListener('click', handleNavigationClick);
});

// Initialize the application 
goToPage(currentPageIndex);