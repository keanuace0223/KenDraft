// Objek untuk melacak waktu perubahan terakhir per slot
let lastPlayed = {};
let allHeroes = [];
let lastHeroNameShown = {}; // Track which heroes have already shown their name (by image source)
let coverStates = {}; // Track cover states: 'closed', 'opening', 'open', 'closing'

// Load hero data
async function loadHeroes() {
    try {
        const response = await fetch('/database/herolist.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading herolist.json:', error);
        return [];
    }
}

// Get hero name from image source
function getHeroName(imgSrc) {
    if (!imgSrc || !allHeroes.length) return "";
    let hero = allHeroes.find(h => h.img === imgSrc);
    return hero ? hero.name : "";
}

// Check if audio is enabled
function isAudioEnabled() {
    const audioToggle = document.getElementById("audio-toggle");
    if (audioToggle) {
        return audioToggle.checked;
    }
    // Default to enabled if toggle doesn't exist
    return true;
}

// Fungsi untuk memutar suara hero
function playVoice(voiceSrc) {
    // Check if audio is enabled
    if (!isAudioEnabled()) {
        return;
    }
    
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

        let heroNameBox = document.getElementById(`hero-name-box-${i}`);
        
        // Get pick cover element
        let pickCover = null;
        if (i <= 10) {
            if (i <= 5) {
                pickCover = document.getElementById(`pick-cover-left-${i}`);
            } else {
                // Right side mapping: slot 6->right-1, 7->right-2, 8->right-3, 9->right-4, 10->right-5
                // HTML order: image-display-10 is with pick-right-5, image-display-6 is with pick-right-1
                // So: slot 10 -> right-5, slot 9 -> right-4, slot 8 -> right-3, slot 7 -> right-2, slot 6 -> right-1
                const rightIndex = i - 5;
                pickCover = document.getElementById(`pick-cover-right-${rightIndex}`);
            }
        }
        
        if (imgSrc) {
            imgElement.src = imgSrc;
            imgElement.style.opacity = "1";
            boxElement.classList.add("show");
            
            // If hero is picked, open the cover to reveal hero
            if (pickCover && i <= 10) {
                const isNewHero = imgSrc && (!coverStates[i] || coverStates[i] !== imgSrc);
                
                // Get picking text container
                const pickingTextContainer = i <= 5 
                    ? document.getElementById(`picking-text-container-left-${i}`)
                    : document.getElementById(`picking-text-container-right-${i - 5}`);
                
                if (isNewHero) {
                    // Hero picked - hide picking text first, then open cover to reveal
                    if (pickingTextContainer) {
                        pickingTextContainer.classList.add("hide-picking");
                    }
                    
                    // Wait for picking text animation, then open cover
                    setTimeout(() => {
                        pickCover.classList.remove("closing");
                        pickCover.classList.add("opening");
                        coverStates[i] = imgSrc;
                    }, 300);
                } else if (coverStates[i] === imgSrc && !pickCover.classList.contains("opening")) {
                    // Hero already picked and cover state matches - ensure cover is open
                    pickCover.classList.remove("closing");
                    if (!pickCover.classList.contains("opening")) {
                        pickCover.classList.add("opening");
                    }
                    // Ensure picking text is hidden when hero is already picked
                    if (pickingTextContainer) {
                        pickingTextContainer.classList.add("hide-picking");
                    }
                } else if (imgSrc && coverStates[i] === imgSrc) {
                    // Hero is already picked - ensure picking text stays hidden
                    if (pickingTextContainer) {
                        pickingTextContainer.classList.add("hide-picking");
                    }
                }
            }
            
            // Update hero name display - only for picked heroes (slots 1-10)
            // Only animate if this is a new hero pick (check by image source, not heroChanged)
            if (heroNameBox && i <= 10) {
                const heroName = getHeroName(imgSrc);
                if (heroName) {
                    heroNameBox.textContent = heroName;
                    // Check if this is a new hero by comparing image source
                    const isNewHero = imgSrc && (!lastHeroNameShown[i] || lastHeroNameShown[i] !== imgSrc);
                    
                    if (isNewHero) {
                        // New hero picked - ensure name is hidden first
                        heroNameBox.classList.remove("show");
                        heroNameBox.style.setProperty("opacity", "0", "important");
                        heroNameBox.style.setProperty("display", "none", "important");
                        heroNameBox.style.setProperty("visibility", "hidden", "important");
                        // Set initial transform to slide from top
                        heroNameBox.style.setProperty("transform", "translateY(-100%)", "important");
                        // Force reflow to ensure class removal is processed
                        void heroNameBox.offsetWidth;
                        // Delay adding show class until after cover opens (0.8s) + 0.2s wait = 1s total
                        setTimeout(() => {
                            // Remove all blocking inline styles
                            heroNameBox.style.removeProperty("display");
                            heroNameBox.style.removeProperty("visibility");
                            heroNameBox.style.removeProperty("opacity");
                            heroNameBox.style.removeProperty("transform");
                            
                            // Make element visible
                            heroNameBox.style.setProperty("visibility", "visible");
                            heroNameBox.style.setProperty("display", "flex");
                            
                            // Force reflow to ensure CSS initial state is applied
                            void heroNameBox.offsetWidth;
                            
                            // Remove and re-add show class to trigger animation
                            heroNameBox.classList.remove("show");
                            void heroNameBox.offsetWidth;
                            
                            // Add show class which will trigger the animation
                            requestAnimationFrame(() => {
                                heroNameBox.classList.add("show");
                                // Force reflow to trigger animation
                                void heroNameBox.offsetWidth;
                            });
                        }, 700);
                        lastHeroNameShown[i] = imgSrc;
                    } else {
                        // Hero already shown - just display without animation
                        heroNameBox.style.display = "flex";
                        heroNameBox.style.opacity = "";
                        heroNameBox.classList.add("show");
                    }
                } else {
                    heroNameBox.textContent = "";
                    heroNameBox.classList.remove("show");
                    lastHeroNameShown[i] = null;
                }
            } else if (heroNameBox) {
                // Hide name box for banned heroes (slots 11-20)
                heroNameBox.textContent = "";
                heroNameBox.classList.remove("show");
            }
            
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
            
            // Hide hero name
            if (heroNameBox) {
                heroNameBox.textContent = "";
                heroNameBox.classList.remove("show");
                lastHeroNameShown[i] = null;
            }
            
            // Reset cover state when hero is removed, but only if slot is not active-pick
            if (pickCover && i <= 10) {
                // Check if this slot is currently active-pick
                const isLeft = i <= 5;
                const pickBoxId = isLeft ? `pick-left-${i}` : `pick-right-${i - 5}`;
                const pickBox = document.getElementById(pickBoxId);
                const isActivePick = pickBox && pickBox.classList.contains("active-pick");
                
                if (!isActivePick) {
                    // Slot is not active-pick, so reset cover state
                    pickCover.classList.remove("opening", "closing");
                    coverStates[i] = null;
                } else {
                    // Slot is active-pick but no hero - ensure cover stays closed
                    if (!pickCover.classList.contains("closing") && !pickCover.classList.contains("opening")) {
                        pickCover.classList.add("closing");
                    }
                    coverStates[i] = null;
                }
            }
            
            // Reset picking text when hero is removed
            const pickingTextContainer = i <= 5 
                ? document.getElementById(`picking-text-container-left-${i}`)
                : document.getElementById(`picking-text-container-right-${i - 5}`);
            if (pickingTextContainer) {
                pickingTextContainer.classList.remove("hide-picking");
            }
            
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
let timerBarAnimationFrame = null; // Variabel untuk menyimpan animation frame timer bar

const phaseElement = document.getElementById('phase');
const arrowElement = document.getElementById('arrow');
const timerElement = document.getElementById('timer');
const timerBar = document.getElementById('timer-bar');
const timerArrow = document.getElementById('timer-arrow');
const timerArrowLeft = document.getElementById('timer-arrow-left');
const timerArrowRight = document.getElementById('timer-arrow-right');
const timerNumber = document.getElementById('timer-number');
const timerPhase = document.getElementById('timer-phase');

function updateUI() {
    let currentPhaseIndex = parseInt(localStorage.getItem("currentPhaseIndex")) || 0;
    let timerFromStorage = parseInt(localStorage.getItem("timer")) || 60;
    let timerRunning = localStorage.getItem("timerRunning") === "true";
    let newUpdateTime = parseInt(localStorage.getItem("updateTime")) || 0;
    let resetTimerBar = localStorage.getItem("resetTimerBar") === "true";

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

        // Reset timer bar if reset flag is set
        if (resetTimerBar) {
            // Stop any running animations
            if (timerBarAnimationFrame) {
                cancelAnimationFrame(timerBarAnimationFrame);
                timerBarAnimationFrame = null;
            }
            
            const timerColor = timerBar.classList.contains('blue-side') ? getComputedStyle(document.documentElement).getPropertyValue('--boredercolor2').trim() : 
                               timerBar.classList.contains('red-side') ? getComputedStyle(document.documentElement).getPropertyValue('--boredercolor').trim() : 
                               getComputedStyle(document.documentElement).getPropertyValue('--boredercolor').trim();
            timerBar.style.transition = 'none';
            updateTimerBarProgress(100, timerColor);
            localStorage.removeItem("resetTimerBar");
        }

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
            if (timerArrowLeft) {
                timerArrowLeft.style.display = 'none';
            }
            if (timerArrowRight) {
                timerArrowRight.style.display = 'none';
            }
            if (timerArrow) {
                timerArrow.className = "timer-arrow";
                timerArrow.style.display = 'none';
            }
        }

        if (timerRunning) {
            const phaseDuration = parseInt(localStorage.getItem("phaseDuration")) || 60;
            animateTimerBar(phaseDuration);
        } else {
            const timerColor = timerBar.classList.contains('blue-side') ? getComputedStyle(document.documentElement).getPropertyValue('--boredercolor2').trim() : 
                               timerBar.classList.contains('red-side') ? getComputedStyle(document.documentElement).getPropertyValue('--boredercolor').trim() : 
                               getComputedStyle(document.documentElement).getPropertyValue('--boredercolor').trim();
            timerBar.style.transition = 'none';
            updateTimerBarProgress(100, timerColor);
        }
        
        updateActiveBoxes();
    }
}

// Function to update timer display with arrow and phase
function updateTimerDisplay(phaseIndex, currentPhase) {
    if ((!timerArrowLeft && !timerArrow) || !timerPhase || !timerNumber) return;
    
    // Determine if it's left (blue) or right (red) side
    const isLeftSide = currentPhase.direction.includes('Left');
    const isRightSide = currentPhase.direction.includes('Right');
    
    // Determine phase type (BANNING or PICKING)
    const isBanning = currentPhase.direction.includes('Banning');
    const isPicking = currentPhase.direction.includes('Picking');
    const isAdjustment = currentPhase.direction.includes('Adjustment');
    
    // Use new dual arrow system if available, otherwise fall back to single arrow
    const leftArrow = timerArrowLeft || timerArrow;
    const rightArrow = timerArrowRight || timerArrow;
    
    // Update arrow position and color
    const timerContainer = document.querySelector('.timer-container');
    const timerbarWrapper = document.querySelector('.timerbar-wrapper');
    
    if (isLeftSide) {
        // Blue side active - blue arrow on left pointing left
        if (timerContainer) {
            timerContainer.classList.remove('adjustment-phase');
        }
        if (timerbarWrapper) {
            timerbarWrapper.classList.remove('adjustment-phase');
        }
        if (leftArrow) {
            // Reset animation for synchronization
            leftArrow.style.animation = 'none';
            void leftArrow.offsetWidth; // Force reflow
            leftArrow.className = 'timer-arrow left';
            leftArrow.style.display = 'block';
            leftArrow.style.animation = ''; // Reapply animation
        }
        if (rightArrow && rightArrow !== leftArrow) {
            rightArrow.style.display = 'none';
        }
        // Update timer bar color to blue
        if (timerBar) {
            timerBar.classList.remove('red-side', 'adjustment-phase');
            timerBar.classList.add('blue-side');
        }
    } else if (isRightSide) {
        // Red side active - red/orange arrow on right pointing right
        if (timerContainer) {
            timerContainer.classList.remove('adjustment-phase');
        }
        if (timerbarWrapper) {
            timerbarWrapper.classList.remove('adjustment-phase');
        }
        if (leftArrow && leftArrow !== rightArrow) {
            leftArrow.style.display = 'none';
        }
        if (rightArrow) {
            // Reset animation for synchronization
            rightArrow.style.animation = 'none';
            void rightArrow.offsetWidth; // Force reflow
            rightArrow.className = 'timer-arrow right';
            rightArrow.style.display = 'block';
            rightArrow.style.animation = ''; // Reapply animation
        }
        // Update timer bar color to red
        if (timerBar) {
            timerBar.classList.remove('blue-side', 'adjustment-phase');
            timerBar.classList.add('red-side');
        }
    } else if (isAdjustment) {
        // Adjustment phase - show both arrows positioned farther apart
        if (timerContainer) {
            timerContainer.classList.add('adjustment-phase');
        }
        if (timerbarWrapper) {
            timerbarWrapper.classList.add('adjustment-phase');
        }
        if (leftArrow) {
            // Reset animation by removing and re-adding class
            leftArrow.style.animation = 'none';
            void leftArrow.offsetWidth; // Force reflow
            leftArrow.className = 'timer-arrow left adjustment';
            leftArrow.style.display = 'block';
            // Reapply animation
            leftArrow.style.animation = '';
        }
        if (rightArrow && rightArrow !== leftArrow) {
            // Reset animation by removing and re-adding class
            rightArrow.style.animation = 'none';
            void rightArrow.offsetWidth; // Force reflow
            rightArrow.className = 'timer-arrow right adjustment';
            rightArrow.style.display = 'block';
            // Reapply animation
            rightArrow.style.animation = '';
        }
        // Gradient for adjustment phase
        if (timerBar) {
            timerBar.classList.remove('blue-side', 'red-side');
            timerBar.classList.add('adjustment-phase');
        }
    } else {
        // Other phase - hide arrows
        if (timerContainer) {
            timerContainer.classList.remove('adjustment-phase');
        }
        if (timerbarWrapper) {
            timerbarWrapper.classList.remove('adjustment-phase');
        }
        if (leftArrow) {
            leftArrow.style.display = 'none';
        }
        if (rightArrow && rightArrow !== leftArrow) {
            rightArrow.style.display = 'none';
        }
        // Default to red
        if (timerBar) {
            timerBar.classList.remove('blue-side', 'adjustment-phase');
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
    // Stop any existing animation
    if (timerBarAnimationFrame) {
        cancelAnimationFrame(timerBarAnimationFrame);
        timerBarAnimationFrame = null;
    }
    
    const timerColor = timerBar.classList.contains('blue-side') ? getComputedStyle(document.documentElement).getPropertyValue('--boredercolor2').trim() : 
                       timerBar.classList.contains('red-side') ? getComputedStyle(document.documentElement).getPropertyValue('--boredercolor').trim() : 
                       getComputedStyle(document.documentElement).getPropertyValue('--boredercolor').trim();
    
    const startTime = Date.now();
    const endTime = startTime + (duration * 1000);
    
    // Reset to full bar
    timerBar.style.transition = "none";
    updateTimerBarProgress(100, timerColor);
    void timerBar.offsetWidth; // Memicu reflow
    
    function updateProgress() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.max(0, 100 - (elapsed / (duration * 1000)) * 100);
        
        if (progress > 0 && now < endTime) {
            updateTimerBarProgress(progress, timerColor);
            timerBarAnimationFrame = requestAnimationFrame(updateProgress);
        } else {
            updateTimerBarProgress(0, timerColor);
            timerBarAnimationFrame = null;
        }
    }
    
    timerBarAnimationFrame = requestAnimationFrame(updateProgress);
}

function updateTimerBarProgress(percentage, color) {
    // Update CSS variables on the timer-bar element
    // Calculate width: at 100% progress, width is 100% (full bar)
    // At 0% progress, width is 0% (compressed to center)
    timerBar.style.setProperty('--progress-width', `${percentage}%`);
    timerBar.style.setProperty('--timer-color', color);
    
    // Also update the shine overlay width
    const timerbarContainer = timerBar.closest('.timerbar');
    if (timerbarContainer) {
        timerbarContainer.style.setProperty('--progress-width', `${percentage}%`);
    }
}

function updateActiveBoxes() {
    let currentPhaseIndex = parseInt(localStorage.getItem("currentPhaseIndex")) || 0;
    document.querySelectorAll(".box").forEach(box => {
        box.classList.remove("active-ban", "active-pick", "blue-side", "red-side");
    });

    if (currentPhaseIndex < phases2.length && currentPhaseIndex < phases.length) {
        const currentPhase = phases[currentPhaseIndex];
        const direction = currentPhase.direction || '';
        const isLeftSide = direction.includes('Left');
        const isRightSide = direction.includes('Right');
        
        // Determine which side is active
        const activeSide = isLeftSide ? 'blue-side' : (isRightSide ? 'red-side' : 'red-side');
        
        phases2[currentPhaseIndex].forEach(boxId => {
            const phaseBox = document.getElementById(boxId);
            if (phaseBox) {
                // 10 ban phase: phases 0-5 (first 6 bans), then 10-13 (next 4 bans) = total 10 bans
                const isBanPhase = (currentPhaseIndex < 6) || (currentPhaseIndex >= 10 && currentPhaseIndex <= 13);
                phaseBox.classList.add(isBanPhase ? "active-ban" : "active-pick");
                phaseBox.classList.add(activeSide);
                
                // If it's a pick phase, close the cover
                if (!isBanPhase) {
                    const isLeft = boxId.includes('pick-left');
                    let coverId = '';
                    let slotIndex = 0;
                    
                    if (isLeft) {
                        const pickIndex = boxId.replace('pick-left-', '');
                        coverId = `pick-cover-left-${pickIndex}`;
                        slotIndex = parseInt(pickIndex);
                    } else {
                        const pickIndex = boxId.replace('pick-right-', '');
                        coverId = `pick-cover-right-${pickIndex}`;
                        // Right side: right-1->slot 6, right-2->slot 7, right-3->slot 8, right-4->slot 9, right-5->slot 10
                        slotIndex = 5 + parseInt(pickIndex);
                    }
                    
                    const pickCover = document.getElementById(coverId);
                    
                    if (pickCover) {
                        // Check if there's a hero already picked
                        const imgSrc = localStorage.getItem(`selectedHero${slotIndex}`);
                        const hasHeroPicked = imgSrc && coverStates[slotIndex] === imgSrc;
                        
                        // Only manage cover state if slot is active-pick
                        // If no hero picked and cover is not opening, ensure it's closed
                        if (!hasHeroPicked) {
                            // No hero picked yet - ensure cover stays closed
                            // Only add closing class if it's not already there and not opening
                            if (!pickCover.classList.contains("closing") && !pickCover.classList.contains("opening")) {
                                pickCover.classList.remove("opening");
                                pickCover.classList.add("closing");
                            }
                        }
                        // If hero is picked, the cover opening is handled in updateDisplay
                        // Don't interfere with it here
                    }
                }
            }
        });
    }
}

// Interval untuk memeriksa perubahan besar dari localStorage
setInterval(updateUI, 250);

// Listener untuk perubahan hero
window.addEventListener("storage", updateDisplay);

// Initialize audio toggle
document.addEventListener("DOMContentLoaded", function() {
    const audioToggle = document.getElementById("audio-toggle");
    if (audioToggle) {
        // Load saved audio state from localStorage
        const savedAudioState = localStorage.getItem("audioEnabled");
        if (savedAudioState !== null) {
            audioToggle.checked = savedAudioState === "true";
        }
        
        // Unlock audio when toggle is turned on
        audioToggle.addEventListener("change", function() {
            localStorage.setItem("audioEnabled", audioToggle.checked);
            if (audioToggle.checked) {
                // Unlock audio by playing a silent audio
                new Audio().play().catch(e => console.log('Audio unlocked'));
            } else {
                // Stop any currently playing audio
                const audio = document.getElementById("hero-voice");
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            }
        });
        
        // Unlock audio on initial load if enabled
        if (audioToggle.checked) {
            new Audio().play().catch(e => console.log('Audio unlocked'));
        }
    }
});

// Inisialisasi awal saat memuat halaman
async function initialize() {
    // Load hero data
    allHeroes = await loadHeroes();
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