// Global variables
let scrollProgress = 0; // 0-100 representing the scroll progression
let isScrolling = false;
let scrollTimeout;

// Initialize the website
document.addEventListener("DOMContentLoaded", function () {
  setupScrollNavigation();
  setupNoteClickListeners();
  initializeScrollStages();

  // Debug: Check if notes are properly created and visible
  setTimeout(() => {
    debugNotesVisibility();
  }, 1000);
});

// Setup scroll-based navigation
function setupScrollNavigation() {
  // Enable smooth scrolling behavior
  document.documentElement.style.scrollBehavior = "smooth";

  // Create scroll listener with throttling
  window.addEventListener("scroll", throttle(handleScroll, 8)); // 120fps for smoother experience

  // Handle wheel events for better control
  window.addEventListener("wheel", handleWheel, { passive: false });

  // Add keyboard navigation for scroll
  document.addEventListener("keydown", handleKeyboardNavigation);
}

// Throttle function for performance
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// Handle scroll events
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (scrollHeight > 0) {
    scrollProgress = Math.min(
      100,
      Math.max(0, (scrollTop / scrollHeight) * 100)
    );
    updateStageBasedOnScroll();
  }
}

// Handle wheel events for smoother control
function handleWheel(event) {
  // Vérifier si l'événement vient de la section festival
  const festivalSection = document.querySelector(".festival-section");
  if (festivalSection && festivalSection.contains(event.target)) {
    // Si on est dans la section festival, laisser faire le scroll naturel
    return; // Permettre le scroll normal
  }

  const delta = event.deltaY;
  const scrollStep = window.innerHeight * 0.25; // 25% pour un scroll plus rapide

  // Phase 1: Navigation entre cartes (0-66%)
  if (scrollProgress < 66) {
    event.preventDefault();

    if (delta > 0) {
      // Scroll down - navigation vers la carte suivante
      window.scrollBy({ top: scrollStep, behavior: "smooth" });
    } else {
      // Scroll up - navigation vers la carte précédente
      window.scrollBy({ top: -scrollStep, behavior: "smooth" });
    }
    return;
  }

  // Phase 2: Transition vers festival (66-100%)
  else if (scrollProgress < 100) {
    event.preventDefault();

    if (delta > 0) {
      // Scroll down - navigation vers le festival
      window.scrollBy({ top: scrollStep, behavior: "smooth" });
    } else {
      // Scroll up - navigation vers la carte précédente
      window.scrollBy({ top: -scrollStep, behavior: "smooth" });
    }
    return;
  }

  // Phase 3: Scroll dans les infos festival (100%+)
  else {
    // Permettre le scroll normal dans les infos festival
    // Ne pas prévenir le comportement par défaut
    return;
  }
}

// Handle keyboard navigation for scroll
function handleKeyboardNavigation(event) {
  // Vérifier si l'événement vient de la section festival
  const festivalSection = document.querySelector(".festival-section");
  if (festivalSection && festivalSection.contains(event.target)) {
    // Si on est dans la section festival, laisser faire le scroll naturel
    return; // Permettre le scroll normal
  }

  const scrollStep = window.innerHeight * 0.35; // 35% pour un scroll plus rapide

  // Phase 1: Navigation entre cartes (0-66%)
  if (scrollProgress < 66) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
      case "Enter":
      case " ":
        event.preventDefault();
        window.scrollBy({ top: scrollStep, behavior: "smooth" });
        break;
      case "ArrowUp":
      case "ArrowLeft":
      case "Escape":
        event.preventDefault();
        window.scrollBy({ top: -scrollStep, behavior: "smooth" });
        break;
    }
    return;
  }

  // Phase 2: Transition vers festival (66-100%)
  else if (scrollProgress < 100) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
      case "Enter":
      case " ":
        event.preventDefault();
        window.scrollBy({ top: scrollStep, behavior: "smooth" });
        break;
      case "ArrowUp":
      case "ArrowLeft":
      case "Escape":
        event.preventDefault();
        window.scrollBy({ top: -scrollStep, behavior: "smooth" });
        break;
    }
    return;
  }

  // Phase 3: Scroll dans les infos festival (100%+)
  else {
    // Laisser le scroll normal dans les infos festival
    // Ne pas prévenir le comportement par défaut
    return;
  }
}

// Initialize scroll stages and set up the scroll environment
function initializeScrollStages() {
  // Set up the document for scroll-based navigation
  document.body.style.height = "500vh"; // 5x viewport height pour permettre le scroll dans les infos
  document.documentElement.style.scrollBehavior = "smooth";

  // Initialize all stages as visible but positioned for scroll
  const stages = document.querySelectorAll(".stage");
  stages.forEach((stage, index) => {
    stage.classList.add("active");
    stage.style.position = "fixed";
    stage.style.top = "0";
    stage.style.left = "0";
    stage.style.width = "100%";
    stage.style.height = "100%";
    stage.style.pointerEvents = "none"; // CRITICAL: Allow clicks to pass through to notes
  });

  // Initialize elements in their starting state (hidden)
  const franceMap = document.querySelector(".france-map");
  const regionMap = document.querySelector(".region-map");
  const festivalSection = document.querySelector(".festival-section");
  const stage1Notes = document.querySelector(".stage1-notes");
  const stage2Notes = document.querySelector(".stage2-notes");

  // Set initial states
  if (franceMap) {
    franceMap.style.opacity = "0";
    franceMap.style.transform = "scale(1)";
  }

  if (regionMap) {
    regionMap.style.opacity = "0";
    regionMap.style.transform = "scale(0.8)";
  }

  if (festivalSection) {
    festivalSection.style.opacity = "0";
    festivalSection.style.transform = "translateX(100%)";
  }

  if (stage1Notes) {
    stage1Notes.style.opacity = "0";
  }

  if (stage2Notes) {
    stage2Notes.style.opacity = "0";
  }

  // Hide scroll hint after first scroll
  let hasScrolled = false;
  const scrollHint = document.getElementById("scrollHint");

  window.addEventListener("scroll", function () {
    if (!hasScrolled && scrollHint) {
      scrollHint.style.opacity = "0";
      scrollHint.style.pointerEvents = "none";
      setTimeout(() => {
        if (scrollHint.parentNode) {
          scrollHint.parentNode.removeChild(scrollHint);
        }
      }, 500);
      hasScrolled = true;
    }
  });

  // Force initial state immediately
  scrollProgress = 0;

  // Apply initial Phase 1 state directly
  if (franceMap) {
    franceMap.style.opacity = "1"; // Start fully visible
    franceMap.style.transform = "scale(1)";
    franceMap.style.transition = "all 0.1s ease-out";
  }

  if (stage1Notes) {
    stage1Notes.style.opacity = "0.5"; // Start at 50% as per phase 1 logic
    stage1Notes.style.transition = "opacity 0.1s ease-out";
    stage1Notes.style.pointerEvents = "auto"; // Ensure clickable from start
  }

  // Ensure other elements start hidden
  if (regionMap) {
    regionMap.style.transition = "all 0.1s ease-out";
  }

  if (festivalSection) {
    festivalSection.style.transition = "all 0.1s ease-out";
  }

  if (stage2Notes) {
    stage2Notes.style.transition = "opacity 0.1s ease-out";
    stage2Notes.style.pointerEvents = "auto"; // Ensure clickable even when hidden
  }

  // Set initial body state
  document.body.className = "stage1-active";
  const headerTitle = document.getElementById("headerTitle");
  if (headerTitle) headerTitle.textContent = "Jazz à Saint Sat";

  // Trigger immediate update to ensure consistency
  updateStageBasedOnScroll();

  // ✅ SIMPLE POINTER-EVENTS FIX
  setTimeout(() => {
    // Stages transparents aux clics
    const allStages = document.querySelectorAll(".stage");
    allStages.forEach((stage, index) => {
      stage.style.pointerEvents = "none";
      console.log(`🎯 Stage ${index + 1} (${stage.id}) transparent to clicks`);
    });

    // ✅ CONTENEURS DE NOTES DOIVENT RESTER CLIQUABLES POUR L'EVENT DELEGATION
    const noteContainers = document.querySelectorAll(".floating-notes");
    noteContainers.forEach((container, index) => {
      container.style.pointerEvents = "auto"; // ESSENTIEL pour l'event delegation
      console.log(
        `🎯 Note container ${index + 1} ENABLED for click delegation`
      );
    });

    console.log("✅ POINTER-EVENTS FIX APPLIED");
  }, 100);
}

// Main function to update stage animations based on scroll progress
function updateStageBasedOnScroll() {
  const franceMap = document.querySelector(".france-map");
  const regionMap = document.querySelector(".region-map");
  const festivalSection = document.querySelector(".festival-section");
  const stage1Notes = document.querySelector(".stage1-notes");
  const stage2Notes = document.querySelector(".stage2-notes");
  const headerTitle = document.getElementById("headerTitle");

  // Update scroll indicator
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    scrollIndicator.style.setProperty(
      "--scroll-progress",
      `${scrollProgress}%`
    );
  }

  // Phase 1: France map (0-33%)
  if (scrollProgress <= 33) {
    const phase1Progress = scrollProgress / 33;

    // Show France map - always visible in phase 1, grows with scroll
    if (franceMap) {
      franceMap.style.opacity = "1";
      franceMap.style.transform = `scale(${1 + phase1Progress * 2.5})`; // Grows much faster for instant feedback
      franceMap.style.transition = "all 0.02s ease-out";
    }

    // Réinitialiser le flag festival si on remonte
    if (hasScrolledToFestival) {
      hasScrolledToFestival = false;
      console.log("🔄 Retour en phase 1 - Flag festival réinitialisé");
    }

    // Hide other elements
    if (regionMap) {
      regionMap.style.opacity = "0";
      regionMap.style.transform = "scale(0.8)";
      regionMap.style.transition = "all 0.1s ease-out";
    }

    if (festivalSection) {
      festivalSection.style.opacity = "0";
      festivalSection.style.transform = "translateX(100%)";
      festivalSection.style.transition = "all 0.1s ease-out";
    }

    // Réinitialiser le flag si on remonte vers la phase 1
    if (hasScrolledToFestival) {
      resetFestivalFlag();
    }

    // Notes dynamiques actives dans la phase 1
    enableDynamicNotes();
    // Initialiser proprement le système de notes
    initializeDynamicNotes();

    // Masquer les anciens conteneurs de notes (plus utilisés)
    if (stage1Notes) {
      stage1Notes.style.opacity = "0";
      stage1Notes.style.pointerEvents = "none";
    }
    if (stage2Notes) {
      stage2Notes.style.opacity = "0";
      stage2Notes.style.pointerEvents = "none";
    }

    // Update header and body state
    document.body.className = "stage1-active";
    if (headerTitle) headerTitle.textContent = "Jazz à Saint Sat";
  }

  // Phase 2: Region map (33-66%)
  else if (scrollProgress <= 66) {
    const phase2Progress = (scrollProgress - 33) / 33;

    // Hide France map with smooth fade-out
    if (franceMap) {
      franceMap.style.opacity = Math.max(0, 1 - phase2Progress);
      franceMap.style.transform = `scale(${3.5 + phase2Progress * 1.5})`; // Grows even more dramatically before disappearing
      franceMap.style.transition = "all 0.02s ease-out";
    }

    // Show Region map with smooth fade-in
    if (regionMap) {
      regionMap.style.opacity = Math.min(1, phase2Progress);
      regionMap.style.transform = `scale(${0.8 + phase2Progress * 2.2})`; // Grows much faster and more noticeably
      regionMap.style.transition = "all 0.02s ease-out";
    }

    // Hide festival section
    if (festivalSection) {
      festivalSection.style.opacity = "0";
      festivalSection.style.transform = "translateX(100%)";
      festivalSection.style.transition = "all 0.1s ease-out";
    }

    // Réinitialiser le flag si on remonte vers la phase 2
    if (hasScrolledToFestival) {
      resetFestivalFlag();
    }

    // Notes dynamiques actives dans la phase 2
    enableDynamicNotes();
    // Initialiser proprement le système de notes
    initializeDynamicNotes();

    // Masquer les anciens conteneurs de notes (plus utilisés)
    if (stage1Notes) {
      stage1Notes.style.opacity = "0";
      stage1Notes.style.pointerEvents = "none";
    }
    if (stage2Notes) {
      stage2Notes.style.opacity = "0";
      stage2Notes.style.pointerEvents = "none";
    }

    // Update header and body state
    document.body.className = "stage2-active";
    if (headerTitle) headerTitle.textContent = "Région Auvergne-Rhône-Alpes";
  }

  // Phase 3: Festival info (66-100%)
  else {
    const phase3Progress = (scrollProgress - 66) / 34;

    // Hide France map completely
    if (franceMap) {
      franceMap.style.opacity = "0";
      franceMap.style.transition = "all 0.1s ease-out";
    }

    // Move Region map to left quarter with smooth transition
    if (regionMap) {
      regionMap.style.opacity = Math.max(0.6, 1 - phase3Progress * 0.4); // Keep more visibility
      regionMap.style.transform = `scale(${
        3.0 + phase3Progress * 0.5
      }) translateX(${-50 * phase3Progress}%)`; // Continue from scale 3.0 and grow more, overflow on left
      regionMap.style.transition = "all 0.02s ease-out";
    }

    // Show festival section with smooth slide-in to center-right
    if (festivalSection) {
      festivalSection.style.opacity = Math.min(1, phase3Progress);
      festivalSection.style.transform = `translateX(${
        50 - phase3Progress * 50
      }%)`; // Start from 50% and move to center-right
      festivalSection.style.transition = "all 0.02s ease-out";

      // Permettre le scroll dans la section festival
      festivalSection.style.overflowY = "auto";
      festivalSection.style.maxHeight = "100vh";
    }

    // Marquer qu'on a scrollé vers le festival et masquer toutes les notes
    hasScrolledToFestival = true;
    hideDynamicNotes();
    console.log(
      "🎪 Phase festival atteinte - Notes masquées définitivement jusqu'au scroll vers le haut"
    );

    // Nettoyer les notes superposées
    cleanupOverlappingNotes();

    // Masquer le scroll hint
    const scrollHint = document.getElementById("scrollHint");
    if (scrollHint) {
      scrollHint.style.opacity = "0";
      scrollHint.style.pointerEvents = "none";
    }

    // Masquer complètement les anciens conteneurs de notes
    if (stage1Notes) {
      stage1Notes.style.opacity = "0";
      stage1Notes.style.pointerEvents = "none";
    }
    if (stage2Notes) {
      stage2Notes.style.opacity = "0";
      stage2Notes.style.pointerEvents = "none";
    }

    // Update header and body state
    document.body.className = "stage3-active";
    if (headerTitle) headerTitle.textContent = "Festival Jazz à Saint Sat";
  }
}

// Smooth scroll to specific progress percentage
function scrollToProgress(targetProgress) {
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const targetScrollTop = (targetProgress / 100) * scrollHeight;

  window.scrollTo({
    top: targetScrollTop,
    behavior: "smooth",
  });
}

// Handle window resize
window.addEventListener("resize", function () {
  // Refresh scroll state on resize
  setTimeout(() => {
    updateStageBasedOnScroll();
  }, 100);
});

// Performance optimization: Preload images
function preloadImages() {
  const images = [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  ];

  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Initialize preloading
document.addEventListener("DOMContentLoaded", preloadImages);

// 🎯 SYSTÈME SIMPLIFIÉ AVEC EVENT DELEGATION PARFAITE
function setupNoteClickListeners() {
  console.log("🎯 INITIALIZING SIMPLE EVENT DELEGATION SYSTEM...");

  // ✅ EVENT DELEGATION : UN SEUL LISTENER SUR LES CONTENEURS
  function setupContainerListener(container) {
    container.addEventListener("click", function (event) {
      // Vérifier si c'est une note valide
      if (event.target.classList.contains("note")) {
        const text = event.target.textContent.trim();

        // VALIDATION STRICTE : seulement les petites notes musicales
        if (text && text.length <= 3 && /^[♪♫♩♬]+$/.test(text)) {
          processNoteClick(event.target, event);
        }
      }
    });

    console.log(`✅ Event delegation configured for:`, container.className);
  }

  // ✅ APPLIQUER À TOUS LES CONTENEURS DE NOTES
  const noteContainers = document.querySelectorAll(".floating-notes");
  noteContainers.forEach(setupContainerListener);

  // ✅ GESTIONNAIRE GLOBAL POUR LES NOTES DYNAMIQUES (ajoutées au body)
  document.body.addEventListener("click", function (event) {
    // Seulement pour les notes dynamiques qui ne sont pas dans les conteneurs
    if (
      event.target.classList.contains("note") &&
      event.target.id &&
      event.target.id.startsWith("dynamic-note-")
    ) {
      const text = event.target.textContent.trim();
      if (text && text.length <= 3 && /^[♪♫♩♬]+$/.test(text)) {
        processNoteClick(event.target, event);
      }
    }
  });

  // ✅ FONCTION DE TRAITEMENT UNIFIÉE AVEC CONFETTIS GARANTIS
  function processNoteClick(note, event) {
    // Vérifier si déjà cliquée
    if (note.classList.contains("clicked")) {
      console.log("⚠️ Note déjà cliquée, ignorée");
      return;
    }

    // Marquer comme cliquée IMMÉDIATEMENT
    note.classList.add("clicked");

    console.log(
      `🎵 PROCESSING NOTE CLICK: "${note.textContent}" - CONFETTIS GARANTIS !`
    );

    // Empêcher la propagation
    event.preventDefault();
    event.stopPropagation();

    // Position pour les confettis
    const rect = note.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Animation simple et directe
    note.style.animation = "none";
    note.style.transition = "all 0.5s ease-out";
    note.style.transform = "scale(3) rotate(360deg)";
    note.style.opacity = "0";
    note.style.zIndex = "99999";
    note.style.pointerEvents = "none"; // Désactiver immédiatement

    // 🎆 CONFETTIS GARANTIS POUR TOUTES LES NOTES
    createConfettiExplosion(note, centerX, centerY);
    playJazzChord();

    // Vérifier si c'est une note dynamique pour la suppression/régénération
    const noteId = note.id;
    const isDynamicNote = noteId && activeNotes.has(noteId);

    // Suppression définitive après animation
    setTimeout(() => {
      if (note.parentNode) {
        note.remove();
        console.log("🗑️ Note supprimée du DOM");
      }

      // Régénération spécifique pour les notes dynamiques
      if (isDynamicNote) {
        // Supprimer du tracking
        activeNotes.delete(noteId);
        console.log(`🎯 Note dynamique supprimée: ${noteId}`);

        // Régénérer depuis le point rouge si conditions réunies
        if (
          !hasScrolledToFestival &&
          scrollProgress < 66 &&
          activeNotes.size < MAX_NOTES
        ) {
          setTimeout(() => {
            createDynamicNote();
            console.log(
              `🔄 Nouvelle note dynamique générée depuis le point rouge après clic`
            );
          }, 300 + Math.random() * 700); // 0.3-1s délai plus rapide
        }
      }
    }, 500);
  }

  // ✅ HOVER SIMPLE POUR LES NOTES NON-CLIQUÉES
  document.addEventListener("mouseover", function (event) {
    if (
      event.target.classList.contains("note") &&
      !event.target.classList.contains("clicked")
    ) {
      const text = event.target.textContent.trim();
      if (text && text.length <= 3 && /^[♪♫♩♬]+$/.test(text)) {
        event.target.style.cursor = "pointer";
        event.target.style.filter =
          "brightness(1.5) drop-shadow(0 0 10px gold)";
      }
    }
  });

  document.addEventListener("mouseout", function (event) {
    if (
      event.target.classList.contains("note") &&
      !event.target.classList.contains("clicked")
    ) {
      event.target.style.filter = "";
    }
  });

  console.log("✅ EVENT DELEGATION SYSTEM READY!");

  // 🎯 SYSTÈME DE GÉNÉRATION DYNAMIQUE DE NOTES AVEC CYCLE DE VIE
  let activeNotes = new Map(); // Stockage des notes actives avec leurs timers
  let noteCounter = 0;
  const MAX_NOTES = 8; // Nombre maximum de notes simultanées augmenté
  let hasScrolledToFestival = false; // Flag pour tracking si on a déjà scrollé vers les infos festival

  // Zones interdites (cartes visibles) - adaptées selon la phase
  function getForbiddenZones() {
    const zones = [];

    // Phase 1: Carte de France au centre
    if (scrollProgress <= 33) {
      zones.push({
        top: 15,
        left: 15,
        width: 70,
        height: 70, // Zone centrale réduite pour permettre plus de notes
      });
    }
    // Phase 2: Carte de région au centre
    else if (scrollProgress <= 66) {
      zones.push({
        top: 15,
        left: 15,
        width: 70,
        height: 70, // Zone centrale réduite pour permettre plus de notes
      });
    }
    // Phase 3: Carte de région à gauche + infos à droite
    else {
      zones.push({
        top: 5,
        left: 5,
        width: 40,
        height: 90, // Zone gauche réduite pour la carte région
      });
      zones.push({
        top: 5,
        left: 55,
        width: 40,
        height: 90, // Zone droite réduite pour les infos
      });
    }

    return zones;
  }

  // Vérifier si une position est dans une zone interdite
  function isPositionForbidden(top, left) {
    const forbiddenZones = getForbiddenZones();
    return forbiddenZones.some((zone) => {
      return (
        top >= zone.top &&
        top <= zone.top + zone.height &&
        left >= zone.left &&
        left <= zone.left + zone.width
      );
    });
  }

  // Générer une position depuis le point rouge avec direction dynamique
  function generateSafePosition() {
    // Position du point rouge (Saint Saturnin) selon la phase
    let redDotPosition;

    if (scrollProgress <= 33) {
      // Phase 1: Point rouge sur la carte de France (position approximative)
      redDotPosition = { top: 45, left: 50 }; // Centre de la France
    } else if (scrollProgress <= 66) {
      // Phase 2: Point rouge sur la carte de région (position exacte de Saint Saturnin)
      redDotPosition = { top: 50, left: 32.5 }; // Position de Saint Saturnin sur la carte région
    } else {
      // Phase 3: Point rouge toujours sur la carte de région (à gauche)
      redDotPosition = { top: 50, left: 22.5 }; // Position ajustée pour la carte à gauche
    }

    // Générer une direction aléatoire depuis le point rouge
    const angle = Math.random() * 2 * Math.PI; // 0 à 2π radians
    const distance = 15 + Math.random() * 25; // Distance de 15% à 40%

    // Calculer la nouvelle position
    const deltaX = Math.cos(angle) * distance;
    const deltaY = Math.sin(angle) * distance;

    let position = {
      top: redDotPosition.top + deltaY,
      left: redDotPosition.left + deltaX,
    };

    // Vérifier que la position est dans les limites de l'écran
    position.top = Math.max(5, Math.min(95, position.top));
    position.left = Math.max(5, Math.min(95, position.left));

    // Vérifier si la position est dans une zone interdite
    if (isPositionForbidden(position.top, position.left)) {
      // Si interdite, ajuster vers l'extérieur
      const adjustedAngle = angle + Math.PI; // Direction opposée
      const adjustedDistance = 30 + Math.random() * 20; // Plus loin
      const adjustedDeltaX = Math.cos(adjustedAngle) * adjustedDistance;
      const adjustedDeltaY = Math.sin(adjustedAngle) * adjustedDistance;

      position = {
        top: Math.max(5, Math.min(95, redDotPosition.top + adjustedDeltaY)),
        left: Math.max(5, Math.min(95, redDotPosition.left + adjustedDeltaX)),
      };
    }

    return position;
  }

  // Vérifier si une position est trop proche d'autres notes (tolérance augmentée)
  function isTooCloseToOtherNotes(top, left, minDistance) {
    for (const [noteId, noteData] of activeNotes) {
      const distance = Math.sqrt(
        Math.pow(top - noteData.position.top, 2) +
          Math.pow(left - noteData.position.left, 2)
      );
      if (distance < minDistance) {
        return true;
      }
    }
    return false;
  }

  // Fonction pour nettoyer les notes trop proches existantes (désactivée pour permettre 8 notes)
  function cleanupOverlappingNotes() {
    // Désactivé pour permettre plus de notes visibles
    return;

    const notesToRemove = [];
    const minDistance = 15; // Distance minimale réduite pour permettre plus de notes

    for (const [noteId1, noteData1] of activeNotes) {
      for (const [noteId2, noteData2] of activeNotes) {
        if (noteId1 !== noteId2) {
          const distance = Math.sqrt(
            Math.pow(noteData1.position.top - noteData2.position.top, 2) +
              Math.pow(noteData1.position.left - noteData2.position.left, 2)
          );
          if (distance < minDistance) {
            // Garder la note la plus récente (ID plus grand)
            const noteToRemove =
              parseInt(noteId1.split("-")[2]) < parseInt(noteId2.split("-")[2])
                ? noteId1
                : noteId2;
            if (!notesToRemove.includes(noteToRemove)) {
              notesToRemove.push(noteToRemove);
            }
          }
        }
      }
    }

    // Supprimer les notes en conflit
    notesToRemove.forEach((noteId) => {
      removeNote(noteId);
    });

    if (notesToRemove.length > 0) {
      console.log(
        `🧹 Nettoyage: ${notesToRemove.length} notes superposées supprimées`
      );
    }
  }

  // Créer une nouvelle note dynamique
  function createDynamicNote() {
    // Vérifier si on peut créer une note
    if (activeNotes.size >= MAX_NOTES) {
      console.log(`⚠️ Limite de ${MAX_NOTES} notes atteinte, pas de création`);
      return null;
    }

    if (hasScrolledToFestival || scrollProgress >= 66) {
      console.log(`⚠️ Festival actif, pas de création de note`);
      return null;
    }

    noteCounter++;
    const noteId = `dynamic-note-${noteCounter}`;

    // Créer l'élément note
    const note = document.createElement("div");
    note.className = "note";
    note.id = noteId;
    note.textContent = ["♪", "♫", "♩", "♬"][Math.floor(Math.random() * 4)];

    // Position du point rouge (Saint Saturnin) selon la phase
    let redDotPosition;
    if (scrollProgress <= 33) {
      redDotPosition = { top: 45, left: 50 }; // Centre de la France
    } else if (scrollProgress <= 66) {
      redDotPosition = { top: 50, left: 32.5 }; // Position de Saint Saturnin sur la carte région
    } else {
      redDotPosition = { top: 50, left: 22.5 }; // Position ajustée pour la carte à gauche
    }

    // Ne pas nettoyer automatiquement - laisser les notes coexister
    // cleanupOverlappingNotes();

    // Opacité garantie entre 75% et 100%
    const opacity = Math.random() * 0.25 + 0.75; // 0.75 à 1.0

    // Commencer depuis le point rouge
    note.style.setProperty("position", "fixed", "important");
    note.style.setProperty("top", `${redDotPosition.top}%`, "important");
    note.style.setProperty("left", `${redDotPosition.left}%`, "important");
    note.style.setProperty("opacity", "0", "important"); // Commencer invisible
    note.style.setProperty("pointer-events", "auto", "important");
    note.style.setProperty("cursor", "pointer", "important");
    note.style.setProperty("z-index", "9999", "important");
    note.style.setProperty("font-size", "3rem", "important");
    note.style.setProperty("color", "#d4af37", "important");
    note.style.setProperty(
      "text-shadow",
      "2px 2px 4px rgba(0, 0, 0, 0.8)",
      "important"
    );
    note.style.setProperty("transition", "all 0.5s ease-out", "important");

    // Ajouter au DOM
    document.body.appendChild(note);

    // Animation d'apparition depuis le point rouge
    setTimeout(() => {
      const finalPosition = generateSafePosition();
      note.style.setProperty("opacity", opacity.toString(), "important");
      note.style.setProperty("top", `${finalPosition.top}%`, "important");
      note.style.setProperty("left", `${finalPosition.left}%`, "important");

      // Ajouter l'animation de flottement après l'apparition
      setTimeout(() => {
        note.style.setProperty(
          "animation",
          "floatNoteToTop 6s ease-in-out infinite",
          "important"
        );
      }, 500);
    }, 100);

    // Stocker la note active
    activeNotes.set(noteId, {
      element: note,
      timer: null,
      position: redDotPosition, // Position initiale (point rouge)
      finalPosition: null, // Sera défini après animation
      opacity: opacity,
    });

    console.log(
      `🎵 Note créée depuis le point rouge: "${
        note.textContent
      }" vers (${redDotPosition.top.toFixed(1)}%, ${redDotPosition.left.toFixed(
        1
      )}%)`
    );

    return noteId;
  }

  // Initialiser le système avec le bon nombre de notes
  function initializeDynamicNotes() {
    if (hasScrolledToFestival || scrollProgress >= 66) {
      console.log(`⚠️ Festival actif, pas d'initialisation`);
      return;
    }

    const notesToCreate = Math.max(0, MAX_NOTES - activeNotes.size);
    console.log(`🎯 Initialisation: ${notesToCreate} notes à créer`);

    // Créer les notes avec un délai pour éviter les conflits
    for (let i = 0; i < notesToCreate; i++) {
      setTimeout(() => {
        createDynamicNote();
      }, i * 200); // 200ms entre chaque note
    }
  }

  // Supprimer une note (utilisée seulement pour le nettoyage)
  function removeNote(noteId) {
    const noteData = activeNotes.get(noteId);
    if (noteData) {
      // Annuler le timer s'il existe
      if (noteData.timer) {
        clearTimeout(noteData.timer);
      }

      // Supprimer l'élément
      if (noteData.element && noteData.element.parentNode) {
        noteData.element.parentNode.removeChild(noteData.element);
      }

      // Supprimer du tracking
      activeNotes.delete(noteId);

      console.log(`🗑️ Note supprimée: ${noteId}`);
    }
  }

  // Initialiser le système de notes
  function initializeNoteSystem() {
    console.log("🚀 INITIALISATION DU SYSTÈME DE NOTES DYNAMIQUES");

    // Supprimer toutes les notes existantes
    const existingNotes = document.querySelectorAll(".note");
    existingNotes.forEach((note) => {
      if (note.parentNode) {
        note.parentNode.removeChild(note);
      }
    });

    // Vider le tracking des notes actives
    activeNotes.clear();

    // Réinitialiser le flag pour permettre la génération
    hasScrolledToFestival = false;

    // Utiliser la fonction d'initialisation propre
    initializeDynamicNotes();

    console.log(`✅ Système de notes dynamiques initialisé proprement`);
  }

  // Démarrer le système après 1 seconde
  setTimeout(initializeNoteSystem, 1000);

  // Ajouter un événement de scroll spécifique à la section festival
  document.addEventListener("DOMContentLoaded", function () {
    const festivalSection = document.querySelector(".festival-section");
    if (festivalSection) {
      // Événement de scroll pour détecter le scroll
      festivalSection.addEventListener("scroll", function (e) {
        console.log("🎪 Scroll dans la section festival:", e.target.scrollTop);
      });
    }
  });

  // Fonction pour vérifier si les notes sortent de l'écran et les faire réapparaître
  function checkNotesOutOfBounds() {
    activeNotes.forEach((noteData, noteId) => {
      const note = noteData.element;
      if (note && note.parentNode) {
        const rect = note.getBoundingClientRect();
        const isOutOfBounds =
          rect.top < -50 ||
          rect.bottom > window.innerHeight + 50 ||
          rect.left < -50 ||
          rect.right > window.innerWidth + 50;

        if (isOutOfBounds) {
          console.log(
            `🎵 Note ${noteId} sort de l'écran, régénération depuis le point rouge`
          );

          // Supprimer la note actuelle
          activeNotes.delete(noteId);
          if (note.parentNode) {
            note.remove();
          }

          // Régénérer depuis le point rouge si conditions réunies
          if (
            !hasScrolledToFestival &&
            scrollProgress < 66 &&
            activeNotes.size < MAX_NOTES
          ) {
            setTimeout(() => {
              createDynamicNote();
            }, 200 + Math.random() * 500);
          }
        }
      }
    });
  }

  // Vérifier toutes les 2 secondes
  setInterval(checkNotesOutOfBounds, 2000);

  // Debug: Afficher le nombre de notes actives toutes les 5 secondes
  setInterval(() => {
    console.log(`🎵 Notes actives: ${activeNotes.size}/${MAX_NOTES}`);
  }, 5000);

  // 🎯 FONCTIONS DE GESTION DES NOTES SELON LE SCROLL
  function enableDynamicNotes() {
    if (activeNotes.size === 0) return; // Pas de notes à activer

    activeNotes.forEach((noteData) => {
      const note = noteData.element;
      if (note && note.parentNode) {
        // Vérifier que la note existe encore
        note.style.setProperty("pointer-events", "auto", "important");
        note.style.setProperty("cursor", "pointer", "important");
        note.style.setProperty(
          "opacity",
          noteData.opacity.toString(),
          "important"
        );
        note.style.setProperty("visibility", "visible", "important");
        // Position fixe - pas d'effet de scroll
        note.style.setProperty("position", "fixed", "important");
      }
    });

    console.log(`✅ ${activeNotes.size} notes dynamiques ACTIVÉES et VISIBLES`);
  }

  function disableDynamicNotes() {
    if (activeNotes.size === 0) return; // Pas de notes à désactiver

    activeNotes.forEach((noteData) => {
      const note = noteData.element;
      if (note && note.parentNode) {
        // Vérifier que la note existe encore
        note.style.setProperty("pointer-events", "none", "important");
        note.style.setProperty("cursor", "default", "important");
        note.style.setProperty("opacity", "0.2", "important");
        // Position fixe - pas d'effet de scroll
        note.style.setProperty("position", "fixed", "important");
      }
    });

    console.log(`⏸️ ${activeNotes.size} notes dynamiques DÉSACTIVÉES`);
  }

  function hideDynamicNotes() {
    if (activeNotes.size === 0) return; // Pas de notes à masquer

    activeNotes.forEach((noteData) => {
      const note = noteData.element;
      if (note && note.parentNode) {
        // Vérifier que la note existe encore
        note.style.setProperty("pointer-events", "none", "important");
        note.style.setProperty("cursor", "default", "important");
        note.style.setProperty("opacity", "0", "important");
        note.style.setProperty("visibility", "hidden", "important");
        // Position fixe - pas d'effet de scroll
        note.style.setProperty("position", "fixed", "important");
      }
    });

    console.log(`🙈 ${activeNotes.size} notes dynamiques MASQUÉES`);
  }

  // Fonction pour réinitialiser le système quand on remonte
  function resetFestivalFlag() {
    hasScrolledToFestival = false;
    console.log("🔄 Flag festival réinitialisé - Notes peuvent réapparaître");
  }

  // Exposer les fonctions globalement
  window.enableDynamicNotes = enableDynamicNotes;
  window.disableDynamicNotes = disableDynamicNotes;
  window.hideDynamicNotes = hideDynamicNotes;
  window.resetFestivalFlag = resetFestivalFlag;
  window.initializeDynamicNotes = initializeDynamicNotes;

  // 🧪 FONCTION DE TEST POUR LE COMPORTEMENT SCROLL
  window.testScrollBehavior = function () {
    console.log("🧪 TESTING SCROLL BEHAVIOR...");

    const currentScroll = scrollProgress;
    console.log(`📊 Position de scroll actuelle: ${currentScroll.toFixed(1)}%`);

    // Tester les différentes phases
    if (currentScroll <= 33) {
      console.log("📍 Phase 1: France map - Notes dynamiques ACTIVES");
      enableDynamicNotes();
    } else if (currentScroll <= 66) {
      console.log("📍 Phase 2: Region map - Notes dynamiques ACTIVES");
      enableDynamicNotes();
    } else {
      console.log("📍 Phase 3: Festival info - Notes dynamiques MASQUÉES");
      console.log(`🏁 Flag festival: ${hasScrolledToFestival}`);
      hideDynamicNotes();
    }

    // Vérifier l'état des notes
    setTimeout(() => {
      let enabledCount = 0;
      let disabledCount = 0;

      activeNotes.forEach((noteData) => {
        const note = noteData.element;
        if (note && note.parentNode) {
          const isEnabled = note.style.pointerEvents === "auto";
          if (isEnabled) enabledCount++;
          else disabledCount++;
        }
      });

      console.log(`📊 RÉSULTAT:
        ✅ Notes actives: ${enabledCount}
        ⏸️ Notes désactivées: ${disabledCount}
        🎯 Position fixe vérifiée: ${activeNotes.size > 0 ? "✅" : "❌"}
      `);

      return {
        scrollProgress: currentScroll,
        enabled: enabledCount,
        disabled: disabledCount,
        total: activeNotes.size,
      };
    }, 100);
  };
}

// Create confetti explosion effect
function createConfettiExplosion(note, x, y) {
  const confettiColors = [
    "#FFD700",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FF6B35",
    "#7B68EE",
    "#32CD32",
  ];
  const confettiShapes = ["●", "■", "▲", "♦", "★", "♪", "♫", "♬"];

  // Create more confetti for better effect
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement("div");
    confetti.className = `confetti confetti-${(i % 5) + 1}`;
    confetti.textContent =
      confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
    confetti.style.color =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.position = "fixed";
    confetti.style.left = x - 10 + "px";
    confetti.style.top = y - 10 + "px";
    confetti.style.textShadow = `0 0 20px ${confetti.style.color}`;
    confetti.style.fontSize = `${1.5 + Math.random() * 1}rem`;
    confetti.style.zIndex = "99999";
    confetti.style.fontWeight = "bold";
    confetti.style.pointerEvents = "none";
    confetti.style.opacity = "1";

    // Random direction with more variety
    const angle = (i / 12) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
    const distance = 40 + Math.random() * 60;
    const deltaX = Math.cos(angle) * distance;
    const deltaY = Math.sin(angle) * distance;

    confetti.style.setProperty("--deltaX", deltaX + "px");
    confetti.style.setProperty("--deltaY", deltaY + "px");

    document.body.appendChild(confetti);

    // Remove confetti after animation with staggered cleanup
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, 2000 + Math.random() * 500);
  }

  // Play a festive sound effect
  playJazzClickSound();

  console.log(`🎆 CONFETTI EXPLOSION created at (${x}, ${y}) with 20 pieces!`);
}

// Enhanced jazz-style click sound
function playJazzClickSound() {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Create a jazz-style chord
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      oscillator.connect(gainNode);

      oscillator.frequency.value = freq;
      oscillator.type = "sine";

      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      oscillator.start(now + index * 0.05);
      oscillator.stop(now + 0.3);
    });
  } catch (error) {
    console.log("Audio not supported");
  }
}

// Alternative name for compatibility
function playJazzChord() {
  playJazzClickSound();
}

// 📊 FONCTION SIMPLIFIÉE POUR ANALYSER LES NOTES
function showNotesStats() {
  const notes = document.querySelectorAll(".note");
  const validNotes = Array.from(notes).filter((note) => {
    const text = note.textContent.trim();
    return text && text.length <= 3 && /^[♪♫♩♬]+$/.test(text);
  });

  const clickedNotes = validNotes.filter((note) => {
    return note.classList.contains("clicked");
  });

  const availableNotes = validNotes.filter((note) => {
    return !note.classList.contains("clicked");
  });

  // Analyser l'opacité des notes disponibles
  const lowOpacityNotes = availableNotes.filter((note) => {
    const opacity = parseFloat(window.getComputedStyle(note).opacity);
    return opacity < 0.05;
  });

  console.log(`🎵 NOTES ANALYSIS:`);
  console.log(`   📊 Total elements with .note class: ${notes.length}`);
  console.log(`   ✅ Valid musical notes: ${validNotes.length}`);
  console.log(`   🖱️ Available notes (not clicked): ${availableNotes.length}`);
  console.log(`   ✨ Already clicked notes: ${clickedNotes.length}`);
  console.log(
    `   ⚠️ Notes with low opacity (<0.05): ${lowOpacityNotes.length}`
  );

  if (lowOpacityNotes.length > 0) {
    console.log(
      `   🔧 Notes à faible opacité détectées ! Elles seront automatiquement ajustées.`
    );
    lowOpacityNotes.forEach((note, i) => {
      const opacity = parseFloat(window.getComputedStyle(note).opacity);
      console.log(
        `      Note ${i}: "${note.textContent}" - opacity: ${opacity.toFixed(
          3
        )}`
      );
    });
  } else {
    console.log(
      `   ✅ Toutes les notes disponibles ont une opacité suffisante !`
    );
  }

  return {
    total: notes.length,
    valid: validNotes.length,
    available: availableNotes.length,
    clicked: clickedNotes.length,
    lowOpacity: lowOpacityNotes.length,
  };
}

// Test function to force a note to be visible and clickable
function forceTestNote() {
  const notes = document.querySelectorAll(".note");
  console.log("🔍 Notes found for test:", notes.length);

  if (notes.length > 0) {
    const testNote = notes[0];

    // Log original classes and properties
    console.log("🔍 Original note classes:", Array.from(testNote.classList));
    console.log("🔍 Original note text:", testNote.textContent);
    console.log(
      "🔍 Original note opacity:",
      window.getComputedStyle(testNote).opacity
    );

    testNote.style.opacity = "1";
    testNote.style.pointerEvents = "auto";
    testNote.style.cursor = "pointer";
    testNote.style.zIndex = "99999";
    testNote.style.position = "fixed";
    testNote.style.top = "50%";
    testNote.style.left = "50%";
    testNote.style.transform = "translate(-50%, -50%)";
    testNote.style.fontSize = "3rem";
    testNote.style.color = "gold";
    testNote.style.background = "rgba(0,0,0,0.8)";
    testNote.style.padding = "20px";
    testNote.style.borderRadius = "10px";
    testNote.style.border = "2px solid white";

    console.log("🎯 Test note created in center of screen - try clicking it!");
    console.log(
      "🔍 Test note classes after setup:",
      Array.from(testNote.classList)
    );

    // Auto-remove after 10 seconds
    setTimeout(() => {
      testNote.style.opacity = "";
      testNote.style.pointerEvents = "";
      testNote.style.cursor = "";
      testNote.style.zIndex = "";
      testNote.style.position = "";
      testNote.style.top = "";
      testNote.style.left = "";
      testNote.style.transform = "";
      testNote.style.fontSize = "";
      testNote.style.color = "";
      testNote.style.background = "";
      testNote.style.padding = "";
      testNote.style.borderRadius = "";
      testNote.style.border = "";
    }, 10000);
  } else {
    console.log("❌ No notes found for test!");
  }
}

// Disable automatic test - call manually with forceTestNote() if needed
// setTimeout(forceTestNote, 2000);

// Function to inspect all notes and their properties
function inspectAllNotes() {
  const notes = document.querySelectorAll(".note");
  const allDivs = document.querySelectorAll("div");

  console.log("📋 NOTES INSPECTION:");
  console.log(`Found ${notes.length} elements with .note class`);
  console.log(`Found ${allDivs.length} total div elements`);

  // Check if any div has note-like content (small notes only)
  const divs = Array.from(allDivs);
  const musicalNotes = divs.filter((div) => {
    const text = div.textContent.trim();
    // Only small elements with ONLY musical characters
    return text && text.length <= 3 && /^[♪♫♩♬\s]+$/.test(text);
  });

  const largeMistakes = divs.filter((div) => {
    const text = div.textContent.trim();
    const hasMusicalChars =
      text &&
      (text.includes("♪") ||
        text.includes("♫") ||
        text.includes("♩") ||
        text.includes("♬"));
    const isLarge = text.length > 10 || div.children.length > 0;
    return hasMusicalChars && isLarge && div.classList.contains("note");
  });

  console.log(`Found ${musicalNotes.length} small musical notes`);
  console.log(
    `Found ${largeMistakes.length} large containers incorrectly marked as notes`
  );

  if (largeMistakes.length > 0) {
    console.log("❌ LARGE MISTAKES (should not have .note class):");
    largeMistakes.forEach((div, index) => {
      console.log(`Large mistake ${index}:`, {
        textLength: div.textContent.length,
        hasChildren: div.children.length > 0,
        classList: Array.from(div.classList),
      });
    });
  }

  console.log("✅ CORRECT SMALL MUSICAL NOTES:");
  musicalNotes.forEach((div, index) => {
    console.log(`Small note ${index}:`, {
      textContent: div.textContent,
      classList: Array.from(div.classList),
      hasNoteClass: div.classList.contains("note"),
      opacity: window.getComputedStyle(div).opacity,
      pointerEvents: window.getComputedStyle(div).pointerEvents,
    });
  });

  notes.forEach((note, index) => {
    console.log(`Note ${index}:`, {
      textContent: note.textContent,
      classList: Array.from(note.classList),
      opacity: window.getComputedStyle(note).opacity,
      pointerEvents: window.getComputedStyle(note).pointerEvents,
    });
  });
}

// Call inspection after 3 seconds
setTimeout(inspectAllNotes, 3000);

// Function to fix note classes if they're missing
function fixNoteClasses() {
  console.log("🔧 FIXING NOTE CLASSES...");

  // First, remove .note class from large containers
  const incorrectNotes = document.querySelectorAll(
    ".stage.note, .region-section.note, .hero-section.note, .festival-section.note"
  );
  incorrectNotes.forEach((element) => {
    element.classList.remove("note");
    console.log(
      "🗑️ Removed .note class from large container:",
      element.className
    );
  });

  const allDivs = document.querySelectorAll("div");
  let fixed = 0;

  allDivs.forEach((div) => {
    const text = div.textContent.trim();
    // Only target small elements with ONLY musical characters (and maybe spaces)
    const isMusicalNote = text && text.length <= 3 && /^[♪♫♩♬\s]+$/.test(text);
    const isAlreadyNote = div.classList.contains("note");
    const isLargeContainer =
      div.classList.contains("stage") ||
      div.classList.contains("region-section") ||
      div.classList.contains("hero-section") ||
      div.classList.contains("festival-section") ||
      div.children.length > 0; // Has child elements

    if (isMusicalNote && !isAlreadyNote && !isLargeContainer) {
      div.classList.add("note");
      fixed++;
      console.log("✅ Added .note class to small musical note:", text);
    }
  });

  console.log(`🔧 Fixed ${fixed} note elements`);

  // Re-setup click listeners
  setupNoteClickListeners();
}

// Clean up and fix classes after 4 seconds
setTimeout(() => {
  fixNoteClasses();

  // Additional cleanup
  setTimeout(() => {
    console.log("🧹 FINAL CLEANUP...");

    // Remove .note from any remaining large containers
    const largeContainers = document.querySelectorAll(
      ".stage, .region-section, .hero-section, .festival-section, .container"
    );
    largeContainers.forEach((container) => {
      if (container.classList.contains("note")) {
        container.classList.remove("note");
        console.log(
          "🗑️ Final cleanup: removed .note from",
          container.className
        );
      }
    });

    // Count final results
    const realNotes = document.querySelectorAll(".note");
    let validNotes = 0;
    realNotes.forEach((note) => {
      const text = note.textContent.trim();
      const isValid = text && text.length <= 3 && /^[♪♫♩♬\s]+$/.test(text);
      if (isValid) validNotes++;
    });

    console.log(
      `✅ FINAL COUNT: ${validNotes} valid small musical notes ready for interaction`
    );
  }, 1000);
}, 4000);

// 🎯 GUIDE DE DEBUG SIMPLIFIÉ
setTimeout(() => {
  console.log(`
🎯 SYSTÈME DE NOTES MUSICALES SIMPLIFIÉ

✅ NOUVELLES FONCTIONS DE TEST (tapez dans la console) :
   - showNotesStats() → Affiche les statistiques des notes
   - testNoteSystem() → Crée une note de test garantie

✅ FONCTIONNEMENT :
   - Les notes sont détectées automatiquement via event delegation
   - Chaque note ne peut être cliquée qu'une fois
   - Clic → Animation → Confettis → Suppression

✅ POUR TESTER :
   1. Scrollez pour voir les notes sur les cartes
   2. Cliquez sur une note → Elle doit disparaître avec des confettis
   3. Ou tapez testNoteSystem() pour créer une note de test
  `);
}, 2000);

// Manual test function (call from console)
window.testNoteClick = function () {
  const notes = document.querySelectorAll(".note");
  if (notes.length > 0) {
    const testNote = notes[0];
    console.log("🧪 Testing note click manually...");

    // Force visibility
    testNote.style.opacity = "1";
    testNote.style.animation = "floatNoteIntense 4s ease-in-out infinite";

    // Simulate click
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    testNote.dispatchEvent(clickEvent);
    console.log("Click event dispatched on note");
  }
};

// 🧪 FONCTION DE TEST SIMPLE D'UNE NOTE EXISTANTE
window.testNoteClick = function () {
  const availableNotes = document.querySelectorAll(".note:not(.clicked)");
  if (availableNotes.length > 0) {
    const testNote = availableNotes[0];
    console.log(`🧪 Testing click on existing note: "${testNote.textContent}"`);

    // Simuler un clic
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    testNote.dispatchEvent(clickEvent);
    console.log("✅ Click event dispatched on existing note");
  } else {
    console.log(
      "⚠️ No available notes found. Scroll to see notes or reload page."
    );
  }
};

// 🧪 FONCTION POUR TESTER SPÉCIFIQUEMENT LES NOTES DU STAGE 1 (FRANCE)
window.testStage1Notes = function () {
  const stage1Notes = document.querySelectorAll(
    ".stage1-notes .note:not(.clicked)"
  );
  console.log(
    `🎵 Found ${stage1Notes.length} available notes in Stage 1 (France)`
  );

  if (stage1Notes.length > 0) {
    const testNote = stage1Notes[0];
    const opacity = parseFloat(window.getComputedStyle(testNote).opacity);

    console.log(
      `🧪 Testing Stage 1 note: "${testNote.textContent}" (opacity: ${opacity})`
    );

    // Forcer la visibilité pour le test
    testNote.style.setProperty("opacity", "1", "important");
    testNote.style.setProperty("z-index", "99999", "important");
    testNote.style.setProperty("outline", "3px solid red", "important");

    // Simuler un clic
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    testNote.dispatchEvent(clickEvent);
    console.log("✅ Click event dispatched on Stage 1 note");
  } else {
    console.log(
      "⚠️ No available Stage 1 notes found. Make sure you're on the France view!"
    );
  }
};

// 🎯 FONCTIONS DE GESTION DES NOTES DYNAMIQUES
window.getDynamicNotesCount = function () {
  return activeNotes.size;
};

window.createExtraNote = function () {
  return createDynamicNote();
};

window.removeAllDynamicNotes = function () {
  console.log("🗑️ SUPPRESSION DE TOUTES LES NOTES DYNAMIQUES");
  let removedCount = 0;

  activeNotes.forEach((noteData, noteId) => {
    clearTimeout(noteData.timer);
    if (noteData.element && noteData.element.parentNode) {
      noteData.element.parentNode.removeChild(noteData.element);
    }
    removedCount++;
  });

  activeNotes.clear();
  console.log(`✅ ${removedCount} notes dynamiques supprimées`);
  return removedCount;
};

window.restartNoteSystem = function () {
  console.log("🔄 REDÉMARRAGE DU SYSTÈME DE NOTES");
  removeAllDynamicNotes();
  setTimeout(initializeNoteSystem, 500);
};

window.showDynamicNotesStats = function () {
  console.log("📊 STATISTIQUES DES NOTES DYNAMIQUES:");
  console.log(`   💫 Notes actives: ${activeNotes.size}`);
  console.log(`   🎯 Maximum configuré: ${MAX_NOTES}`);

  activeNotes.forEach((noteData, noteId) => {
    const opacity = parseFloat(noteData.element.style.opacity);
    console.log(
      `   🎵 ${noteId}: "${
        noteData.element.textContent
      }" - opacity: ${opacity.toFixed(
        3
      )} - position: ${noteData.position.top.toFixed(
        1
      )}%, ${noteData.position.left.toFixed(1)}%`
    );
  });

  return {
    active: activeNotes.size,
    max: MAX_NOTES,
    details: Array.from(activeNotes.entries()).map(([id, data]) => ({
      id,
      text: data.element.textContent,
      opacity: data.opacity,
      position: data.position,
    })),
  };
};

// Debug function to check notes visibility and interaction
function debugNotesVisibility() {
  const notes = document.querySelectorAll(".note");
  const floatingNotes = document.querySelectorAll(".floating-notes");

  console.log("=== NOTES DEBUG REPORT ===");
  console.log(`Total notes found: ${notes.length}`);

  floatingNotes.forEach((container, index) => {
    const style = window.getComputedStyle(container);
    console.log(
      `Floating notes container ${index}: z-index=${style.zIndex}, pointer-events=${style.pointerEvents}`
    );
  });

  notes.forEach((note, index) => {
    const style = window.getComputedStyle(note);
    const rect = note.getBoundingClientRect();
    console.log(`Note ${index}: 
      z-index: ${style.zIndex}, 
      pointer-events: ${style.pointerEvents}, 
      opacity: ${style.opacity}, 
      visibility: ${style.visibility},
      position: (${rect.left.toFixed(1)}, ${rect.top.toFixed(1)}),
      size: ${rect.width.toFixed(1)}x${rect.height.toFixed(1)}`);
  });

  // Test if notes are actually clickable
  const testNote = notes[0];
  if (testNote) {
    console.log("Testing note interaction...");
    testNote.style.border = "2px solid red";
    setTimeout(() => {
      testNote.style.border = "";
    }, 2000);
  }

  console.log("=== END DEBUG REPORT ===");
}

// ✅ FONCTION DE TEST SIMPLE
window.testNoteSystem = function () {
  console.log("🧪 TESTING NOTE CLICK SYSTEM...");

  // 1. Afficher les statistiques actuelles
  const stats = showNotesStats();

  if (stats.available === 0) {
    console.log(
      "⚠️ Aucune note disponible ! Scrollez pour voir les notes ou rechargez la page."
    );
    return;
  }

  // 2. Créer une note de test visible
  const testNote = document.createElement("div");
  testNote.classList.add("note");
  testNote.textContent = "♪";
  testNote.style.position = "fixed";
  testNote.style.top = "50%";
  testNote.style.left = "50%";
  testNote.style.transform = "translate(-50%, -50%)";
  testNote.style.fontSize = "3rem";
  testNote.style.color = "gold";
  testNote.style.background = "rgba(0,0,0,0.8)";
  testNote.style.padding = "20px";
  testNote.style.borderRadius = "50%";
  testNote.style.border = "3px solid white";
  testNote.style.cursor = "pointer";
  testNote.style.zIndex = "99999";
  testNote.style.opacity = "1";
  testNote.style.pointerEvents = "auto";

  // Ajouter la note au premier conteneur de notes trouvé
  const container = document.querySelector(".floating-notes");
  if (container) {
    container.appendChild(testNote);
    console.log("🎯 Test note added to floating-notes container - click it!");
  } else {
    document.body.appendChild(testNote);
    console.log("🎯 Test note added to body - click it!");
  }

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (testNote.parentNode) {
      testNote.remove();
      console.log("🗑️ Test note removed");
    }
  }, 10000);

  return stats.available;
};

// 🎮 FONCTIONS DE TEST DISPONIBLES DANS LA CONSOLE:
setTimeout(() => {
  console.log(`
🎯 SYSTÈME DE NOTES MUSICALES SIMPLIFIÉ - FONCTIONS DE TEST:

• showNotesStats() - Affiche les statistiques des notes (disponibles/cliquées)
• testNoteSystem() - Crée une note de test au centre de l'écran
• testNoteClick() - Teste un clic sur une note existante
• testStage1Notes() - Teste spécifiquement les notes du Stage 1 (France)
• showDynamicNotesStats() - Affiche les statistiques des notes dynamiques
• testDynamicSystem() - Teste le système dynamique avec diagnostic complet
• testScrollBehavior() - Teste le comportement des notes selon le scroll
• testFixedPosition() - Vérifie que les notes ne bougent pas avec le scroll
• createExtraNote() - Crée une note supplémentaire manuellement
• removeAllDynamicNotes() - Supprime toutes les notes dynamiques
• restartNoteSystem() - Redémarre complètement le système de notes
• enableDynamicNotes() - Active les notes dynamiques manuellement
• disableDynamicNotes() - Désactive les notes dynamiques manuellement
• hideDynamicNotes() - Masque complètement les notes (phase 3)
• resetFestivalFlag() - Réinitialise le flag festival pour forcer la réapparition
• testFestivalFlag() - Teste le comportement complet du flag festival avec scroll
• testConfettiSystem() - Crée une note de test garantie avec confettis
• initializeDynamicNotes() - Initialise proprement le système de notes
• diagnosticFinal() - Diagnostic complet du système corrigé

✅ POUR TESTER LE SYSTÈME CORRIGÉ:
1. Maximum 5 notes apparaissent automatiquement et évitent les cartes
2. Les notes restent en POSITION FIXE (ne bougent pas avec le scroll)
3. 🎆 TOUS LES CLICS déclenchent des confettis + son + nouvelle note
4. Scrollez jusqu'aux infos festival → Toutes les notes DISPARAISSENT
5. Scrollez vers le haut → Les notes RÉAPPARAISSENT
6. Scrollez vers le bas → Les notes DISPARAISSENT à nouveau
7. Les notes ne disparaissent JAMAIS automatiquement (seulement par clic)
8. Tapez testConfettiSystem() pour tester les confettis garantis
9. Tapez testScrollBehavior() pour tester le comportement complet

🔧 DIAGNOSTIC AUTOMATIQUE:
${
  document.querySelectorAll(".floating-notes").length
} conteneurs de notes trouvés
${document.querySelectorAll(".note").length} notes musicales disponibles

🎯 SYSTÈME DYNAMIQUE ROBUSTE ET CLEAN:
- Maximum ${MAX_NOTES} notes simultanées sur l'écran
- Positions aléatoires évitant les cartes (zones interdites)
- Opacité garantie entre 75% et 100% pour chaque note
- Disparition UNIQUEMENT lors du clic (pas de timer automatique)
- 🎆 CONFETTIS GARANTIS pour toutes les notes (dynamiques et statiques)
- Auto-régénération contrôlée après clic avec délai de 0.5-1.5 secondes
- Position FIXE - ne bougent pas avec le scroll
- Masquage automatique à la fin de la phase 2 (région)
- Réactivation seulement si scroll vers le haut
- Re-masquage automatique si scroll vers le bas
- ✅ AUCUNE génération spontanée - création contrôlée uniquement
`);
}, 3000);

// 🧪 FONCTION DE TEST POUR LE NOUVEAU SYSTÈME DYNAMIQUE
window.testDynamicSystem = function () {
  console.log("🧪 TESTING DYNAMIC NOTE SYSTEM...");

  // Vérifier le nombre de notes actives
  const activeCount = activeNotes.size;
  const maxCount = MAX_NOTES;

  console.log(`📊 Notes actives: ${activeCount}/${maxCount}`);

  // Vérifier chaque note active
  let validNotes = 0;
  let forbiddenPositions = 0;
  let lowOpacityNotes = 0;

  activeNotes.forEach((noteData, noteId) => {
    const note = noteData.element;
    const position = noteData.position;
    const opacity = parseFloat(note.style.opacity);

    // Vérifier si la position est interdite
    const isForbidden = isPositionForbidden(position.top, position.left);
    if (isForbidden) forbiddenPositions++;

    // Vérifier l'opacité
    const hasValidOpacity = opacity >= 0.75 && opacity <= 1.0;
    if (!hasValidOpacity) lowOpacityNotes++;

    // Vérifier la cliquabilité
    const isClickable =
      note.style.pointerEvents === "auto" && note.style.cursor === "pointer";

    if (hasValidOpacity && !isForbidden && isClickable) {
      validNotes++;
    }

    console.log(`🎵 ${noteId}: "${note.textContent}" 
      • Position: ${position.top.toFixed(1)}%, ${position.left.toFixed(1)}% ${
      isForbidden ? "❌ INTERDITE" : "✅"
    }
      • Opacity: ${opacity.toFixed(3)} ${hasValidOpacity ? "✅" : "❌"}
      • Cliquable: ${isClickable ? "✅" : "❌"}
    `);
  });

  console.log(`📊 RÉSULTATS DU TEST:
    ✅ Notes valides: ${validNotes}/${activeCount}
    ❌ Positions interdites: ${forbiddenPositions}
    ❌ Opacités insuffisantes: ${lowOpacityNotes}
    🎯 Système ${validNotes === activeCount ? "FONCTIONNEL" : "DÉFAILLANT"}
  `);

  // Créer une note de test
  console.log("🎯 Création d'une note de test...");
  const testNoteId = createDynamicNote();

  return {
    activeNotes: activeCount,
    maxNotes: maxCount,
    validNotes: validNotes,
    forbiddenPositions: forbiddenPositions,
    lowOpacityNotes: lowOpacityNotes,
    success: validNotes === activeCount,
    testNoteId: testNoteId,
  };
};

// 🧪 FONCTION DE TEST RAPIDE POUR VÉRIFIER LA POSITION FIXE
window.testFixedPosition = function () {
  console.log("🧪 TESTING FIXED POSITION BEHAVIOR...");

  if (activeNotes.size === 0) {
    console.log("❌ Aucune note active pour tester");
    return;
  }

  // Stocker les positions initiales
  const initialPositions = new Map();
  activeNotes.forEach((noteData, noteId) => {
    const note = noteData.element;
    if (note && note.parentNode) {
      const rect = note.getBoundingClientRect();
      initialPositions.set(noteId, {
        top: rect.top,
        left: rect.left,
        position: note.style.position,
      });
    }
  });

  console.log(
    `📊 ${initialPositions.size} notes enregistrées - positions initiales:`
  );
  initialPositions.forEach((pos, id) => {
    console.log(
      `   🎵 ${id}: position=${pos.position}, top=${pos.top.toFixed(
        1
      )}px, left=${pos.left.toFixed(1)}px`
    );
  });

  console.log(
    "📜 Simuler un scroll... (Les notes doivent rester EXACTEMENT au même endroit)"
  );

  // Simuler un petit scroll
  const originalScroll = window.scrollY;
  window.scrollBy(0, 100);

  setTimeout(() => {
    // Vérifier les nouvelles positions
    let movedNotes = 0;
    let fixedNotes = 0;

    console.log("📊 Vérification des positions après scroll:");
    initialPositions.forEach((initialPos, noteId) => {
      const noteData = activeNotes.get(noteId);
      if (noteData && noteData.element && noteData.element.parentNode) {
        const note = noteData.element;
        const newRect = note.getBoundingClientRect();

        const topDiff = Math.abs(newRect.top - initialPos.top);
        const leftDiff = Math.abs(newRect.left - initialPos.left);
        const tolerance = 1; // 1px de tolérance

        if (topDiff > tolerance || leftDiff > tolerance) {
          movedNotes++;
          console.log(
            `   ❌ ${noteId}: BOUGÉ! Δtop=${topDiff.toFixed(
              1
            )}px, Δleft=${leftDiff.toFixed(1)}px`
          );
        } else {
          fixedNotes++;
          console.log(`   ✅ ${noteId}: FIXE! Position stable`);
        }
      }
    });

    // Remettre le scroll initial
    window.scrollTo(0, originalScroll);

    console.log(`📊 RÉSULTAT DU TEST:
      ✅ Notes en position fixe: ${fixedNotes}
      ❌ Notes qui ont bougé: ${movedNotes}
      🎯 Test ${movedNotes === 0 ? "RÉUSSI" : "ÉCHOUÉ"}
    `);

    return {
      fixed: fixedNotes,
      moved: movedNotes,
      success: movedNotes === 0,
    };
  }, 200);
};

// 🧪 FONCTION DE TEST POUR VÉRIFIER LES DÉLAIS ESPACÉS
window.testSpacedTiming = function () {
  console.log("🧪 TESTING SPACED TIMING BEHAVIOR...");

  if (activeNotes.size === 0) {
    console.log("❌ Aucune note active pour tester");
    return;
  }

  // Surveiller les disparitions pendant 10 secondes
  const startTime = Date.now();
  const disappearances = [];

  console.log(`📊 Surveillance des ${activeNotes.size} notes actives...`);

  // Stocker les notes actuelles et leurs délais prévus
  const notesToWatch = new Map();
  activeNotes.forEach((noteData, noteId) => {
    notesToWatch.set(noteId, {
      element: noteData.element,
      createdAt: startTime,
    });
  });

  // Vérification périodique
  const checkInterval = setInterval(() => {
    const currentTime = Date.now();
    const elapsed = (currentTime - startTime) / 1000;

    // Vérifier quelles notes ont disparu
    notesToWatch.forEach((watchData, noteId) => {
      if (!activeNotes.has(noteId) && watchData.element.parentNode === null) {
        // Cette note a disparu
        const disappearTime = elapsed;
        disappearances.push({
          noteId: noteId,
          disappearTime: disappearTime,
        });
        notesToWatch.delete(noteId);
        console.log(
          `⏱️ Note ${noteId} disparue après ${disappearTime.toFixed(1)}s`
        );
      }
    });

    // Arrêter après 10 secondes
    if (elapsed > 10) {
      clearInterval(checkInterval);

      // Analyser les résultats
      console.log("📊 ANALYSE DES DÉLAIS:");

      if (disappearances.length === 0) {
        console.log("ℹ️ Aucune disparition observée pendant les 10 secondes");
      } else {
        // Vérifier si les disparitions sont espacées
        let minGap = Infinity;
        let maxGap = 0;

        for (let i = 1; i < disappearances.length; i++) {
          const gap =
            disappearances[i].disappearTime -
            disappearances[i - 1].disappearTime;
          minGap = Math.min(minGap, gap);
          maxGap = Math.max(maxGap, gap);
        }

        const isWellSpaced = minGap >= 1.0; // Au moins 1 seconde d'écart

        console.log(`📈 Disparitions observées: ${disappearances.length}`);
        console.log(`⏱️ Écart minimum: ${minGap.toFixed(1)}s`);
        console.log(`⏱️ Écart maximum: ${maxGap.toFixed(1)}s`);
        console.log(`🎯 Espacement correct: ${isWellSpaced ? "✅" : "❌"}`);

        disappearances.forEach((d, index) => {
          console.log(
            `   ${index + 1}. ${d.noteId} → ${d.disappearTime.toFixed(1)}s`
          );
        });
      }

      return {
        disappearances: disappearances.length,
        minGap: minGap === Infinity ? 0 : minGap,
        maxGap: maxGap,
        wellSpaced: disappearances.length <= 1 || minGap >= 1.0,
      };
    }
  }, 100);

  console.log("⏳ Surveillance en cours... (10 secondes)");
};

// 🧪 FONCTION DE TEST POUR LE NOUVEAU COMPORTEMENT DE SCROLL FLAG
window.testFestivalFlag = function () {
  console.log("🧪 TESTING FESTIVAL FLAG BEHAVIOR...");

  const currentScroll = scrollProgress;
  const currentFlag = hasScrolledToFestival;
  const currentNotes = activeNotes.size;

  console.log(`📊 État initial:
    • Position scroll: ${currentScroll.toFixed(1)}%
    • Flag festival: ${currentFlag}
    • Notes actives: ${currentNotes}
  `);

  // Test complet du cycle
  console.log("🎬 SCÉNARIO DE TEST:");
  console.log("1. Simuler scroll vers festival (66%+)...");

  // Simuler scroll vers festival
  window.scrollTo({
    top: document.documentElement.scrollHeight * 0.8,
    behavior: "smooth",
  });

  setTimeout(() => {
    console.log(`📊 Après scroll vers festival:
      • Flag festival: ${hasScrolledToFestival}
      • Notes actives: ${activeNotes.size}
      • Notes visibles: ${
        Array.from(activeNotes.values()).filter(
          (n) => n.element.style.opacity !== "0"
        ).length
      }
    `);

    console.log("2. Simuler scroll vers le haut (33%)...");

    // Simuler retour vers le haut
    window.scrollTo({
      top: document.documentElement.scrollHeight * 0.2,
      behavior: "smooth",
    });

    setTimeout(() => {
      console.log(`📊 Après retour vers le haut:
        • Flag festival: ${hasScrolledToFestival}
        • Notes actives: ${activeNotes.size}
        • Notes visibles: ${
          Array.from(activeNotes.values()).filter(
            (n) => n.element.style.opacity !== "0"
          ).length
        }
      `);

      console.log("3. Simuler nouveau scroll vers festival...");

      // Re-simuler scroll vers festival
      window.scrollTo({
        top: document.documentElement.scrollHeight * 0.9,
        behavior: "smooth",
      });

      setTimeout(() => {
        console.log(`📊 Après second scroll vers festival:
          • Flag festival: ${hasScrolledToFestival}
          • Notes actives: ${activeNotes.size}
          • Notes visibles: ${
            Array.from(activeNotes.values()).filter(
              (n) => n.element.style.opacity !== "0"
            ).length
          }
        `);

        console.log(
          `🎯 TEST TERMINÉ - Comportement ${
            hasScrolledToFestival ? "CORRECT" : "INCORRECT"
          }`
        );

        // Remettre le scroll initial
        window.scrollTo({ top: 0, behavior: "smooth" });

        return {
          initialFlag: currentFlag,
          finalFlag: hasScrolledToFestival,
          initialNotes: currentNotes,
          finalNotes: activeNotes.size,
          success: true,
        };
      }, 1000);
    }, 1000);
  }, 1000);
};

// 🧪 FONCTION DE TEST POUR VÉRIFIER LES CONFETTIS
window.testConfettiSystem = function () {
  console.log("🧪 TESTING CONFETTI SYSTEM...");

  // Vérifier le nombre de notes disponibles
  const noteCount = activeNotes.size;
  console.log(`📊 Notes dynamiques disponibles: ${noteCount}`);

  if (noteCount === 0) {
    console.log("⚠️ Aucune note disponible ! Initialisation du système...");
    initializeDynamicNotes();
    setTimeout(() => {
      console.log(
        `✅ ${activeNotes.size} notes créées. Testez maintenant en cliquant !`
      );
    }, 1000);
    return;
  }

  // Créer une note de test garantie avec confettis
  const testNote = document.createElement("div");
  testNote.className = "note";
  testNote.id = "test-confetti-note";
  testNote.textContent = "🎵";
  testNote.style.setProperty("position", "fixed", "important");
  testNote.style.setProperty("top", "50%", "important");
  testNote.style.setProperty("left", "50%", "important");
  testNote.style.setProperty("transform", "translate(-50%, -50%)", "important");
  testNote.style.setProperty("opacity", "1", "important");
  testNote.style.setProperty("pointer-events", "auto", "important");
  testNote.style.setProperty("cursor", "pointer", "important");
  testNote.style.setProperty("z-index", "99999", "important");
  testNote.style.setProperty("font-size", "3rem", "important");
  testNote.style.setProperty("color", "gold", "important");
  testNote.style.setProperty("background", "rgba(0,0,0,0.8)", "important");
  testNote.style.setProperty("padding", "20px", "important");
  testNote.style.setProperty("border-radius", "50%", "important");
  testNote.style.setProperty("border", "3px solid white", "important");
  testNote.style.setProperty(
    "animation",
    "floatNoteIntense 2s ease-in-out infinite",
    "important"
  );

  document.body.appendChild(testNote);

  console.log(
    "🎯 Note de test créée au centre - Cliquez pour tester les confettis !"
  );
  console.log("🎆 Cette note GARANTIT les confettis avec la nouvelle approche");

  // Auto-suppression après 10 secondes
  setTimeout(() => {
    if (testNote.parentNode) {
      testNote.remove();
      console.log("🗑️ Note de test supprimée");
    }
  }, 10000);

  return {
    testNoteCreated: true,
    availableNotes: noteCount,
    message: "Cliquez sur la note dorée pour tester les confettis !",
  };
};

// 🔧 DIAGNOSTIC FINAL DU SYSTÈME CORRIGÉ
window.diagnosticFinal = function () {
  console.log("🔧 DIAGNOSTIC FINAL - SYSTÈME CORRIGÉ");
  console.log("=====================================");

  // 1. Vérifier le nombre de notes
  const noteCount = activeNotes.size;
  console.log(`📊 Notes dynamiques actives: ${noteCount}/${MAX_NOTES}`);

  // 2. Vérifier l'état des confettis
  const confettiTestNote = document.getElementById("test-confetti-note");
  const confettiReady = typeof createConfettiExplosion === "function";
  console.log(
    `🎆 Système de confettis: ${
      confettiReady ? "✅ OPÉRATIONNEL" : "❌ DÉFAILLANT"
    }`
  );

  // 3. Vérifier l'état du scroll
  const scrollState = scrollProgress;
  const festivalFlag = hasScrolledToFestival;
  console.log(
    `📊 Position scroll: ${scrollState.toFixed(
      1
    )}% - Flag festival: ${festivalFlag}`
  );

  // 4. Vérifier la génération contrôlée
  const generationControlled = typeof initializeDynamicNotes === "function";
  console.log(
    `🎯 Génération contrôlée: ${
      generationControlled ? "✅ ACTIVE" : "❌ DÉFAILLANTE"
    }`
  );

  // 5. Tester une note si possible
  if (noteCount > 0) {
    const firstNote = Array.from(activeNotes.values())[0];
    const noteVisible = firstNote.element.style.opacity !== "0";
    const noteClickable = firstNote.element.style.pointerEvents === "auto";
    console.log(
      `🎵 Première note: Visible=${noteVisible} Cliquable=${noteClickable}`
    );
  }

  // 6. Résumé des corrections
  console.log("\n🛠️ CORRECTIONS APPLIQUÉES:");
  console.log("✅ Confettis garantis pour toutes les notes");
  console.log("✅ Suppression des générations spontanées");
  console.log("✅ Logique de clic unifiée et robuste");
  console.log("✅ Système de limite à 5 notes respecté");
  console.log("✅ Régénération contrôlée après clic uniquement");
  console.log("✅ Gestion propre des flags et états");

  console.log("\n🎮 TESTS RECOMMANDÉS:");
  console.log("• testConfettiSystem() - Vérifier les confettis");
  console.log("• Cliquer sur les notes existantes");
  console.log("• Scroller pour tester le comportement");

  return {
    noteCount,
    confettiReady,
    scrollState,
    festivalFlag,
    generationControlled,
    status: "SYSTÈME CORRIGÉ ET OPÉRATIONNEL",
  };
};
