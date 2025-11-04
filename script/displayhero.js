// Objek untuk melacak waktu perubahan terakhir per slot
let lastPlayed = {};

// Fungsi untuk memutar suara hero
function playVoice(voiceSrc) {
    let audio = document.getElementById("hero-voice");
    let currentPhaseIndex = parseInt(localStorage.getItem("currentPhaseIndex")) || 0;
    if (currentPhaseIndex === phases.length - 1) {
        audio.volume = 0;
    } else {
        audio.volume = 1;
    }
    audio.pause();
    audio.currentTime = 0;
    audio.src = voiceSrc;
    audio.play().catch(error => console.error('Error playing audio:', error));
}

// Cache untuk hero list
let heroListCache = null;

// Load hero list once
async function loadHeroList() {
    if (!heroListCache) {
        try {
            const response = await fetch('/database/herolist.json');
            heroListCache = await response.json();
        } catch (error) {
            console.error('Error loading hero list:', error);
            heroListCache = [];
        }
    }
    return heroListCache;
}

// Extract hero name from image path
function getHeroNameFromPath(imgSrc) {
    if (!imgSrc) return '';
    const match = imgSrc.match(/\/([^\/]+)\.png$/);
    if (match) {
        return match[1].split('/').pop().replace('.png', '');
    }
    return '';
}

// Get hero name from hero list
async function getHeroName(imgSrc) {
    if (!imgSrc) return '';
    const heroList = await loadHeroList();
    const heroName = getHeroNameFromPath(imgSrc);
    const hero = heroList.find(h => h.img === imgSrc || h.img === `/${imgSrc}` || h.img.includes(heroName));
    return hero ? hero.name : heroName.charAt(0).toUpperCase() + heroName.slice(1);
}

// Fungsi untuk memperbarui tampilan dropdown dan gambar
async function updateDisplay() {
    for (let i = 1; i <= 20; i++) {
        let imgSrc = localStorage.getItem(`selectedHero${i}`);
        let voiceSrc = localStorage.getItem(`selectedVoice${i}`);
        let heroChanged = localStorage.getItem(`heroChanged${i}`);
        let imgElement = document.getElementById(`image-display-${i}`);
        let boxElement = document.getElementById(`image-box-${i}`);
        let cloneImgElement = document.getElementById(`clone-image-display-${i}`);
        let cloneBoxElement = document.getElementById(`clone-image-box-${i}`);
        let heroNameElement = document.getElementById(`hero-name-${i}`);

        if (imgSrc) {
            imgElement.src = imgSrc;
            imgElement.style.opacity = "1";
            boxElement.classList.add("show");
            if (cloneImgElement && cloneBoxElement) {
                cloneImgElement.src = imgSrc;
                cloneImgElement.style.opacity = "1";
                cloneBoxElement.classList.add("show");
            }
            // Update hero name banner
            if (heroNameElement) {
                const heroName = await getHeroName(imgSrc);
                heroNameElement.innerHTML = heroName ? `<span>${heroName}</span>` : '';
                if (heroName) {
                    heroNameElement.classList.add("show");
                } else {
                    heroNameElement.classList.remove("show");
                }
            }
            if (voiceSrc && heroChanged && (!lastPlayed[i] || lastPlayed[i] !== heroChanged)) {
                playVoice(voiceSrc);
                lastPlayed[i] = heroChanged;
            }
        } else {
            imgElement.src = "";
            imgElement.style.opacity = "0";
            boxElement.classList.remove("show");
            if (cloneImgElement && cloneBoxElement) {
                cloneImgElement.src = "";
                cloneImgElement.style.opacity = "0";
                cloneBoxElement.classList.remove("show");
            }
            // Hide hero name banner
            if (heroNameElement) {
                heroNameElement.classList.remove("show");
                heroNameElement.innerHTML = '';
            }
            lastPlayed[i] = null;
        }
    }
}

// Array fase untuk timer dan arah panah
const phases = [
    { type: "", direction: "/Assets/Other/LeftBanning.gif" },
    { type: "", direction: "/Assets/Other/RightBanning.gif" },
    { type: "", direction: "/Assets/Other/LeftBanning.gif" },
    { type: "", direction: "/Assets/Other/RightBanning.gif" },
    { type: "", direction: "/Assets/Other/LeftBanning.gif" },
    { type: "", direction: "/Assets/Other/RightBanning.gif" },
    { type: "", direction: "/Assets/Other/LeftPicking.gif" },
    { type: "", direction: "/Assets/Other/RightPicking.gif" },
    { type: "", direction: "/Assets/Other/LeftPicking.gif" },
    { type: "", direction: "/Assets/Other/RightPicking.gif" },
    { type: "", direction: "/Assets/Other/RightBanning.gif" },
    { type: "", direction: "/Assets/Other/LeftBanning.gif" },
    { type: "", direction: "/Assets/Other/RightBanning.gif" },
    { type: "", direction: "/Assets/Other/LeftBanning.gif" },
    { type: "", direction: "/Assets/Other/RightPicking.gif" },
    { type: "", direction: "/Assets/Other/LeftPicking.gif" },
    { type: "", direction: "/Assets/Other/RightPicking.gif" },
    { type: "", direction: "/Assets/Other/Adjustment.gif" }
];

// Array fase untuk menyalakan box di display
const phases2 = [
    ["ban-left-1"], ["ban-right-1"], ["ban-left-2"], ["ban-right-2"],
    ["ban-left-3"], ["ban-right-3"], ["pick-left-1"], ["pick-right-1", "pick-right-2"],
    ["pick-left-2", "pick-left-3"], ["pick-right-3"], ["ban-right-4"], ["ban-left-4"],
    ["ban-right-5"], ["ban-left-5"], ["pick-right-4"], ["pick-left-4", "pick-left-5"],
    ["pick-right-5"], []
];

// --- PERBAIKAN UTAMA DIMULAI DI SINI ---

let lastUpdateTime = 0;
let localTimerValue = 0;
let timerCountdownInterval = null; // Variabel untuk menyimpan interval timer lokal

const phaseElement = document.getElementById('phase');
const arrowElement = document.getElementById('arrow');
const arrowRightElement = document.getElementById('arrow-right');
const timerElement = document.getElementById('timer');
const timerBar = document.getElementById('timer-bar');
const phaseTextElement = document.getElementById('phase-text');

// Verify arrow element exists
if (!arrowElement) {
    console.error('Arrow element not found in DOM!');
} else {
    console.log('Arrow element found:', arrowElement);
}

// Fungsi untuk memperbarui visual timer (low-time warning)
function updateTimerVisuals(timeValue) {
    const countdownElement = timerElement.closest('.countdown');
    const lowTimeThreshold = 10;
    
    if (timeValue <= lowTimeThreshold && timeValue > 0) {
        timerBar.classList.add('low-time');
        if (countdownElement) {
            countdownElement.classList.add('low-time');
        }
    } else {
        timerBar.classList.remove('low-time');
        if (countdownElement) {
            countdownElement.classList.remove('low-time');
        }
    }
}

function updateArrow(isLeft, isBanning, isPicking) {
    if (!arrowElement) {
        console.error('Arrow element not found!');
        return;
    }
    
    const arrowRightElement = document.getElementById('arrow-right');
    const timerDisplayWrapper = document.querySelector('.timer-display-wrapper');
    if (!timerDisplayWrapper) {
        console.error('Timer display wrapper not found!');
        return;
    }
    
    // Remove all classes
    arrowElement.classList.remove('red', 'blue', 'left', 'right', 'color-change');
    if (arrowRightElement) {
        arrowRightElement.classList.remove('red', 'blue', 'left', 'right', 'color-change');
    }
    timerDisplayWrapper.classList.remove('arrow-left', 'arrow-right');
    
    // Arrow should be on the side that's active and point to that side
    // Left side = Blue team → Arrow on LEFT side, points LEFT → BLUE arrow
    // Right side = Red team → Arrow on RIGHT side, points RIGHT → RED arrow
    
    if (isLeft) {
        // Left side (Blue team) is active - arrow on left side, points left, blue
        timerDisplayWrapper.classList.add('arrow-left');
        arrowElement.classList.add('left', 'blue');
        console.log('Arrow updated: LEFT side (blue), arrow on left pointing left, classes:', arrowElement.className);
    } else {
        // Right side (Red team) is active - arrow on right side, points right, red
        timerDisplayWrapper.classList.add('arrow-right');
        if (arrowRightElement) {
            arrowRightElement.classList.add('right', 'red');
            console.log('Arrow updated: RIGHT side (red), arrow on right pointing right, classes:', arrowRightElement.className);
        }
    }
    
    // Trigger color change animation on the active arrow
    const activeArrow = isLeft ? arrowElement : arrowRightElement;
    if (activeArrow) {
        activeArrow.classList.add('color-change');
        setTimeout(() => {
            activeArrow.classList.remove('color-change');
        }, 500);
    }
}

function updateUI() {
    let currentPhaseIndex = parseInt(localStorage.getItem("currentPhaseIndex")) || 0;
    let timerFromStorage = parseInt(localStorage.getItem("timer")) || 60;
    let timerRunning = localStorage.getItem("timerRunning") === "true";
    let newUpdateTime = parseInt(localStorage.getItem("updateTime")) || 0;

    // Update teks timer langsung dari nilai lokal agar terlihat mulus
    const currentTimerValue = localTimerValue > 0 ? localTimerValue : timerFromStorage;
    timerElement.textContent = currentTimerValue;
    updateTimerVisuals(currentTimerValue);

    // Always update arrow and phase text based on current phase
    if (currentPhaseIndex < phases.length) {
        const currentPhase = phases[currentPhaseIndex];
        phaseElement.textContent = currentPhase.type;
        
        // Determine team and action from phase
        const direction = currentPhase.direction.toLowerCase();
        const isLeft = direction.includes('left');
        const isRight = direction.includes('right');
        const isBanning = direction.includes('banning');
        const isPicking = direction.includes('picking');
        const isAdjustment = direction.includes('adjustment');
        
        // Debug logging
        console.log(`Phase ${currentPhaseIndex}: ${currentPhase.direction}, Lowercase: ${direction}, isLeft: ${isLeft}, isRight: ${isRight}, isPicking: ${isPicking}, isBanning: ${isBanning}`);
        
        // Update arrow color and direction
        // If RightPicking/RightBanning → Red side active → Arrow points RIGHT (red)
        // If LeftPicking/LeftBanning → Blue side active → Arrow points LEFT (blue)
        // Explicitly check for Right first, then Left
        if (isRight) {
            // Right side (Red team) is active - arrow points right and is red
            console.log('Detected RIGHT side - Setting arrow to RIGHT (red)');
            updateArrow(false, isBanning, isPicking); // isLeft = false
        } else if (isLeft) {
            // Left side (Blue team) is active - arrow points left and is blue
            console.log('Detected LEFT side - Setting arrow to LEFT (blue)');
            updateArrow(true, isBanning, isPicking); // isLeft = true
        } else {
            console.warn('No direction detected in phase!', currentPhase.direction);
            // Default to right (red) if no direction detected
            updateArrow(false, isBanning, isPicking);
        }
        
        // Update phase text
        if (isAdjustment) {
            phaseTextElement.textContent = "ADJUSTMENT";
        } else if (isBanning) {
            phaseTextElement.textContent = "BANNING";
        } else if (isPicking) {
            phaseTextElement.textContent = "PICKING";
        }
    } else {
        phaseElement.textContent = "All Phases Completed";
        phaseTextElement.textContent = "COMPLETE";
        arrowElement.classList.remove('red', 'blue', 'left', 'right');
    }

    if (newUpdateTime !== lastUpdateTime) {
        lastUpdateTime = newUpdateTime;

        // Reset dan mulai hitung mundur lokal
        startLocalCountdown(timerFromStorage, timerRunning);

        if (timerRunning) {
            const phaseDuration = parseInt(localStorage.getItem("phaseDuration")) || 60;
            animateTimerBar(phaseDuration);
        } else {
            timerBar.style.transition = 'none';
            timerBar.style.transform = 'scaleX(1)';
        }
        
        // Update visual state untuk timer
        updateTimerVisuals(localTimerValue > 0 ? localTimerValue : timerFromStorage);
        
        updateActiveBoxes();
    }
}

// Fungsi untuk memulai atau menghentikan hitung mundur LOKAL
function startLocalCountdown(startTime, isRunning) {
    // Selalu hentikan interval sebelumnya untuk mencegah duplikasi
    clearInterval(timerCountdownInterval);
    
    localTimerValue = startTime;
    timerElement.textContent = localTimerValue;
    updateTimerVisuals(localTimerValue);

    if (isRunning) {
        timerCountdownInterval = setInterval(() => {
            if (localTimerValue > 0) {
                localTimerValue--;
                timerElement.textContent = localTimerValue;
                updateTimerVisuals(localTimerValue);
            } else {
                clearInterval(timerCountdownInterval);
                updateTimerVisuals(0);
            }
        }, 1000);
    }
}

function animateTimerBar(duration) {
    timerBar.style.transition = "none";
    timerBar.style.transform = "scaleX(1)";
    void timerBar.offsetWidth; // Memicu reflow
    timerBar.style.transition = `transform ${duration}s linear`;
    timerBar.style.transform = "scaleX(0)";
}

function updateActiveBoxes() {
    let currentPhaseIndex = parseInt(localStorage.getItem("currentPhaseIndex")) || 0;
    document.querySelectorAll(".box").forEach(box => {
        box.classList.remove("active-ban", "active-pick");
    });

    if (currentPhaseIndex < phases2.length) {
        phases2[currentPhaseIndex].forEach(boxId => {
            const phaseBox = document.getElementById(boxId);
            if (phaseBox) {
                const isBanPhase = (currentPhaseIndex < 6) || (currentPhaseIndex >= 10 && currentPhaseIndex <= 13);
                phaseBox.classList.add(isBanPhase ? "active-ban" : "active-pick");
            }
        });
    }
}

// Interval untuk memeriksa perubahan besar dari localStorage
setInterval(updateUI, 250);

// Listener untuk perubahan hero
window.addEventListener("storage", () => {
    updateDisplay().catch(err => console.error('Error updating display:', err));
});

// Inisialisasi awal saat memuat halaman
async function initialize() {
    // Lakukan sinkronisasi awal
    lastUpdateTime = parseInt(localStorage.getItem("updateTime")) || 0;
    let timerFromStorage = parseInt(localStorage.getItem("timer")) || 60;
    let timerRunning = localStorage.getItem("timerRunning") === "true";
    
    startLocalCountdown(timerFromStorage, timerRunning);
    
    // Panggil semua fungsi update
    await updateDisplay().catch(err => console.error('Error updating display:', err));
    updateActiveBoxes();
    
    // Panggil updateUI sekali lagi untuk memastikan state visual lainnya benar
    updateUI();
}

initialize();