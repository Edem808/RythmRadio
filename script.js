// --- CORRECTION DE L'IMPORT ICI ---
import * as textmode from 'textmode.js';

// --- CONFIGURATION ---
const VIDEO_PATH = '/background.mp4'; 
const AUDIO_ID = 'myAudio';

console.log("Script chargé avec succès.");

// 1. Initialisation de Textmode en Plein Écran
const t = textmode.create({
    container: document.getElementById('ascii-container'),
    // On force la largeur/hauteur pour remplir la fenêtre
    width: window.innerWidth,
    height: window.innerHeight,
    fontSize: 6, // Essaie 6, 8, 12 ou 20 pour voir la différence !
});

let myVideo;
const audio = document.getElementById(AUDIO_ID);
const statusText = document.querySelector('.status');

// 2. Chargement de la vidéo
t.setup(async () => {
    try {
        console.log("Chargement de la vidéo...");
        
        // On charge la vidéo
        myVideo = await t.loadVideo(VIDEO_PATH);
        console.log("Vidéo chargée !");
        
        // --- Configuration du rendu ---
        myVideo.characters(" .:/@");
        myVideo.charColorMode("fixed").charColor(233, 237, 240);
        myVideo.cellColorMode("fixed").cellColor (0, 0, 0);  // Noir
        
        // On active la boucle et la lecture auto
        myVideo.loop();
        myVideo.play();

    } catch (error) {
        console.error("ERREUR :", error);
        alert("Impossible de charger la vidéo. Vérifie le dossier 'public'.");
    }
});

// 3. Boucle de rendu
t.draw(() => {
    t.background(0);
    if (myVideo) {
        // On dessine la vidéo sur toute la grille disponible
        t.image(myVideo, t.grid.cols, t.grid.rows);
    }
});

if (audio) {
    audio.volume = 0.5;
    
    // Sélection des nouveaux éléments du DOM
    const playPauseBtn = document.getElementById('btn-play-pause');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const timelineBox = document.getElementById('timeline-box');

    // -- Gestion Play / Pause (Bouton unique) --
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                if(myVideo) myVideo.play(); // Sync avec la vidéo de fond
                playPauseBtn.innerHTML = "||"; // Symbole Pause
            } else {
                audio.pause();
                // Optionnel : if(myVideo) myVideo.pause(); 
                playPauseBtn.innerHTML = "|&gt;"; // Symbole Play
            }
        });
    }

    // -- Mise à jour de la barre de progression et du temps --
    audio.addEventListener('timeupdate', () => {
        // Calcul du pourcentage
        const percent = (audio.currentTime / audio.duration) * 100;
        
        // Mise à jour visuelle (largeur de la div)
        if (progressBar) progressBar.style.width = percent + '%';
        
        // Mise à jour du texte
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        if (durationEl && !isNaN(audio.duration)) {
            durationEl.textContent = formatTime(audio.duration);
        }
    });

    // -- Clic sur la timeline pour avancer/reculer --
    if (timelineBox) {
        timelineBox.addEventListener('click', (e) => {
            const rect = timelineBox.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const percent = clickX / width;
            
            if (!isNaN(audio.duration)) {
                audio.currentTime = percent * audio.duration;
            }
        });
    }
}

// Fonction utilitaire pour le format 00:00
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 5. Gestion du Redimensionnement (PAS TOUCHÉ)
window.addEventListener('resize', () => {
   location.reload();
});
