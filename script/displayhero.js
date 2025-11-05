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

// Fungsi untuk memperbarui tampilan dropdown dan gambar
function updateDisplay() {
    for (let i = 1; i <= 20; i++) {
        let imgSrc = localStorage.getItem(`selectedHero${i}`);
        let voiceSrc = localStorage.getItem(`selectedVoice${i}`);
        let heroChanged = localStorage.getItem(`heroChanged${i}`);
        let imgElement = document.getElementById(`image-display-${i}`);
        let boxElement = document.getElementById(`image-box-${i}`);
        let cloneImgElement = document.getElementById(`clone-image-display-${i}`);
        let cloneBoxElement = document.getElementById(`clone-image-box-${i}`);

        if (imgSrc) {
            imgElement.src = imgSrc;
            imgElement.style.opacity = "1";
            boxElement.classList.add("show");
            if (cloneImgElement && cloneBoxElement) {
                cloneImgElement.src = imgSrc;
                cloneImgElement.style.opacity = "1";
                cloneBoxElement.classList.add("show");
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
const timerElement = document.getElementById('timer');
const timerBar = document.getElementById('timer-bar');
const timerArrow = document.getElementById('timer-arrow');
const timerNumber = document.getElementById('timer-number');
const timerPhase = document.getElementById('timer-phase');

function updateUI() {
    let currentPhaseIndex = parseInt(localStorage.getItem("currentPhaseIndex")) || 0;
    let timerFromStorage = parseInt(localStorage.getItem("timer")) || 60;
    let timerRunning = localStorage.getItem("timerRunning") === "true";
    let newUpdateTime = parseInt(localStorage.getItem("updateTime")) || 0;

    // Update teks timer langsung dari nilai lokal agar terlihat mulus
    let displayTimer = localTimerValue > 0 ? localTimerValue : timerFromStorage;
    if (timerElement) {
        timerElement.textContent = displayTimer;
    }
    if (timerNumber) {
        timerNumber.textContent = displayTimer;
    }

    if (newUpdateTime !== lastUpdateTime) {
        lastUpdateTime = newUpdateTime;

        // Reset dan mulai hitung mundur lokal
        startLocalCountdown(timerFromStorage, timerRunning);

        if (currentPhaseIndex < phases.length) {
            const currentPhase = phases[currentPhaseIndex];
            if (phaseElement) {
                phaseElement.textContent = currentPhase.type;
            }
            if (arrowElement) {
                arrowElement.src = currentPhase.direction;
            }
            
            // Update new timer design
            updateTimerDisplay(currentPhaseIndex, currentPhase);
        } else {
            if (phaseElement) {
                phaseElement.textContent = "All Phases Completed";
            }
            if (arrowElement) {
                arrowElement.src = "";
            }
            if (timerPhase) {
                timerPhase.textContent = "";
            }
            if (timerArrow) {
                timerArrow.className = "timer-arrow";
            }
        }

        if (timerRunning) {
            const phaseDuration = parseInt(localStorage.getItem("phaseDuration")) || 60;
            animateTimerBar(phaseDuration);
        } else {
            timerBar.style.transition = 'none';
            timerBar.style.transform = 'translateX(-50%) scaleX(1)';
        }
        
        updateActiveBoxes();
    }
}

// Function to update timer display with arrow and phase
function updateTimerDisplay(phaseIndex, currentPhase) {
    if (!timerArrow || !timerPhase || !timerNumber) {
        console.log('Timer elements not found:', {timerArrow, timerPhase, timerNumber});
        return;
    }
    
    // Determine if it's left (blue) or right (red) side
    const direction = currentPhase.direction || '';
    const isLeftSide = direction.includes('Left');
    const isRightSide = direction.includes('Right');
    
    console.log('Updating timer display:', {phaseIndex, direction, isLeftSide, isRightSide});
    
    // Determine phase type (BANNING or PICKING)
    const isBanning = direction.includes('Banning');
    const isPicking = direction.includes('Picking');
    const isAdjustment = direction.includes('Adjustment');
    
    // Update arrow position and color
    if (isLeftSide) {
        // Blue side active - blue arrow on left pointing left
        timerArrow.className = 'timer-arrow left';
        timerArrow.style.display = 'block';
        console.log('Arrow set to left (blue)');
        // Update timer bar color to blue
        if (timerBar) {
            timerBar.classList.remove('red-side');
            timerBar.classList.add('blue-side');
        }
    } else if (isRightSide) {
        // Red side active - red/orange arrow on right pointing right
        timerArrow.className = 'timer-arrow right';
        timerArrow.style.display = 'block';
        console.log('Arrow set to right (orange)');
        // Update timer bar color to red
        if (timerBar) {
            timerBar.classList.remove('blue-side');
            timerBar.classList.add('red-side');
        }
    } else {
        // Adjustment or other - hide arrow
        timerArrow.className = 'timer-arrow';
        timerArrow.style.display = 'none';
        console.log('Arrow hidden');
        // Default to red for adjustment phase
        if (timerBar) {
            timerBar.classList.remove('blue-side');
            timerBar.classList.add('red-side');
        }
    }
    
    // Update phase text
    if (isBanning) {
        timerPhase.textContent = 'BANNING';
    } else if (isPicking) {
        timerPhase.textContent = 'PICKING';
    } else if (isAdjustment) {
        timerPhase.textContent = 'ADJUSTMENT';
    } else {
        timerPhase.textContent = '';
    }
    
    // Trigger animations
    timerNumber.classList.remove('updated');
    timerPhase.classList.remove('updated');
    setTimeout(() => {
        timerNumber.classList.add('updated');
        timerPhase.classList.add('updated');
    }, 10);
}

// Fungsi untuk memulai atau menghentikan hitung mundur LOKAL
function startLocalCountdown(startTime, isRunning) {
    // Selalu hentikan interval sebelumnya untuk mencegah duplikasi
    clearInterval(timerCountdownInterval);
    
    localTimerValue = startTime;
    if (timerElement) {
        timerElement.textContent = localTimerValue;
    }
    if (timerNumber) {
        timerNumber.textContent = localTimerValue;
    }

    if (isRunning) {
        timerCountdownInterval = setInterval(() => {
            if (localTimerValue > 0) {
                localTimerValue--;
                if (timerElement) {
                    timerElement.textContent = localTimerValue;
                }
                if (timerNumber) {
                    timerNumber.textContent = localTimerValue;
                }
            } else {
                clearInterval(timerCountdownInterval);
            }
        }, 1000);
    }
}


function animateTimerBar(duration) {
    timerBar.style.transition = "none";
    timerBar.style.transform = "translateX(-50%) scaleX(1)";
    void timerBar.offsetWidth; // Memicu reflow
    timerBar.style.transition = `transform ${duration}s linear`;
    timerBar.style.transform = "translateX(-50%) scaleX(0)";
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
window.addEventListener("storage", updateDisplay);

// Inisialisasi awal saat memuat halaman
function initialize() {
    // Lakukan sinkronisasi awal
    lastUpdateTime = parseInt(localStorage.getItem("updateTime")) || 0;
    let timerFromStorage = parseInt(localStorage.getItem("timer")) || 60;
    let timerRunning = localStorage.getItem("timerRunning") === "true";
    
    startLocalCountdown(timerFromStorage, timerRunning);
    
    // Panggil semua fungsi update
    updateDisplay();
    updateActiveBoxes();
    
    // Panggil updateUI sekali lagi untuk memastikan state visual lainnya benar
    updateUI();
    
    // Initialize timer display on load
    let currentPhaseIndex = parseInt(localStorage.getItem("currentPhaseIndex")) || 0;
    if (currentPhaseIndex < phases.length && phases[currentPhaseIndex]) {
        const currentPhase = phases[currentPhaseIndex];
        if (phaseElement) {
            phaseElement.textContent = currentPhase.type;
        }
        if (arrowElement) {
            arrowElement.src = currentPhase.direction;
        }
        updateTimerDisplay(currentPhaseIndex, currentPhase);
    }
    if (timerRunning) {
        const phaseDuration = parseInt(localStorage.getItem("phaseDuration")) || 60;
        animateTimerBar(phaseDuration);
    }
}

initialize();