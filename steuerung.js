console.log('steuerung.js geladen – Screen:', document.body.dataset.screen);

// Spruch-Liste für spruchwahl.html
const phrases = [
  'Love Cats hate Fascism',
  'Nazi Freie Zone',
  'Ruhig Brauner',
  'Nazis verschwinden!',
  'Antifaschismus zum Aufkleben',
  'Sorry, der Nazisticker war hässlich',
  'Upsi, hier stand mal was Peinliches'
];

// Symbol-Liste für symbolwahl.html
const symbols = [
  'Symbole/JustText.png',
  'Symbole/Cat.png',
  'Symbole/Fairy.png',
  'Symbole/Fist.png',
  'Symbole/Spray.png'
];
let currentSymbolIndex = 0;
let currentPhraseIndex = 0; // Start bei Spruch 1

let isPrinting = false; // verhindert mehrfaches Auslösen auf dem Druck-Screen
let highlightedText = null;
// Lade die gespeicherte Auswahl, falls vorhanden
let lastModeSelection = localStorage.getItem('modeSelection') || 'selbermachen'; // Default-Wert 'selbermachen'
console.log('Steuerung geladen, Screen:', document.body.dataset.screen);
let isSelected = false; // Diese Variable überwacht, ob eine Auswahl getroffen wurde
let isColorSelected = false;

// === Initialzustand beim Laden setzen ===
const initialScreen = document.body.dataset.screen || 'unknown';

// Spruchwahl: direkt ersten Spruch aus dem Array anzeigen
if (initialScreen === 'spruch') {
  const phraseElement = document.querySelector('.phrase-text');
  if (phraseElement) {
    phraseElement.textContent = phrases[currentPhraseIndex]; // = phrases[0]
  }
}

// Symbolwahl: direkt erstes Symbol anzeigen
if (initialScreen === 'symbol') {
  const symbolImg = document.querySelector('.symbol-image');
  if (symbolImg) {
    symbolImg.src = symbols[currentSymbolIndex]; // = symbols[0]
  }
}

// globaler Key-Listener für ALLE Seiten
document.addEventListener('keydown', function (event) {
  const screen = document.body.dataset.screen || 'unknown';

  // Space soll nicht scrollen
  if (event.code === 'Space' || event.key === ' ') {
    event.preventDefault();
  }

    // Pfeiltasten sollen auch nicht scrollen
  if (event.code === 'ArrowUp' || event.code === 'ArrowDown' || event.code === 'ArrowLeft') {
    event.preventDefault();
  }

    // ========== Rückwärts-Navigation ==========
  if (event.code === 'ArrowLeft') {
    switch (screen) {
      // ========== STARTDISPLAY (keine Rück-Navigation) ==========
      case 'startdisplay':
        // Keine Rück-Navigation auf dieser Seite
        break;

      // ========== MODUSWAHL ==========
      case 'mode':
        window.location.href = 'startdisplay.html';  // Zurück zur Startseite
        break;

      // ========== SPRUCHWAHL ==========
      case 'spruch':
        window.location.href = 'modus.html';  // Zurück zur Moduswahl
        break;

      // ========== SYMBOLWAHL ==========
      case 'symbol':
        window.location.href = 'spruchwahl.html';  // Zurück zur Spruchwahl
        break;

      // ========== FARBWAHL ==========
      case 'farbe':
        window.location.href = 'symbolwahl.html';  // Zurück zur Symbolwahl
        break;

      // ========== PRÄSENTATION ==========
      case 'druck': {
        // Überprüfen, ob "random" oder "selbermachen" aktiviert ist
        if (lastModeSelection === 'random') {
          window.location.href = 'modus.html';  // Zurück zur Moduswahl bei Random
        } else {
          window.location.href = 'symbolwahl.html';  // Zurück zur Symbolwahl bei Selbermachen
        }
        break;
      }

      // ========== GEDRUCKT ==========
      case 'done':
        // Keine Rück-Navigation auf dieser Seite
        break;

      default:
        break;
    }
  }

  switch (screen) {
    // ========== STARTSEITE ==========
    case 'start':
      if (event.code === 'Space') {
        window.location.href = 'modus.html';
      }
      break;

    // ========== MODUSWAHL ==========
    case 'mode': {
      const randomText = document.getElementById('mod-1');
      const selbText = document.getElementById('mod-2');
      
      if (!randomText || !selbText) break; // wenn es das Element nicht gibt, nichts tun

      if (event.code === 'ArrowDown') {
        // Pfeil nach unten: "Selber machen" soll größer werden
        highlightText('mod-2', randomText, selbText);
        isSelected = true;
        lastModeSelection = 'selbermachen'; // Speichern der Auswahl
        localStorage.setItem('modeSelection', 'selbermachen');  // Speichern in localStorage
      }

      if (event.code === 'ArrowUp') {
        // Pfeil nach oben: "Random" soll größer werden
        highlightText('mod-1', randomText, selbText);
        isSelected = true; // Auswahl getroffen
        lastModeSelection = 'random'; // Speichern der Auswahl
        localStorage.setItem('modeSelection', 'random');  // Speichern in localStorage
      }

      if (event.code === 'Space' && isSelected) {
        // Weiterleitung je nach Auswahl:
        if (lastModeSelection === 'random') {
          window.location.href = 'praesentation.html'; // Gehe direkt zu Präsentation
        } else {
          window.location.href = 'spruchwahl.html'; // Gehe zu Spruchwahl
        }
      }

      break;
    }

    // ========== SPRUCHWAHL ==========
    case 'spruch':
      const phraseElement = document.querySelector('.phrase-text');

      // Sicherheit: wenn das Element nicht gefunden wird, nichts tun
      if (!phraseElement) break;

      if (event.code === 'ArrowDown') {
        // nächster Spruch
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        phraseElement.textContent = phrases[currentPhraseIndex];
      }

      if (event.code === 'ArrowUp') {
        // vorheriger Spruch
        currentPhraseIndex =
          (currentPhraseIndex - 1 + phrases.length) % phrases.length;
        phraseElement.textContent = phrases[currentPhraseIndex];
      }

      if (event.code === 'Space') {
        window.location.href = 'symbolwahl.html';
      }
      break;

    // ========== SYMBOLWAHL ==========
    case 'symbol': {
      const symbolImg = document.querySelector('.symbol-image');

      if (!symbolImg) break; // falls irgendwas nicht geladen ist

      // nach unten: nächstes Symbol
      if (event.code === 'ArrowDown') {
        currentSymbolIndex = (currentSymbolIndex + 1) % symbols.length;
        symbolImg.src = symbols[currentSymbolIndex];
      }

      // nach oben: vorheriges Symbol
      if (event.code === 'ArrowUp') {
        currentSymbolIndex =
          (currentSymbolIndex - 1 + symbols.length) % symbols.length;
        symbolImg.src = symbols[currentSymbolIndex];
      }

      // Space: weiter zur Farbwahl-Seite
      if (event.code === 'Space') {
        window.location.href = 'color.html';  // so wie du es schon drin hattest
      }
      break;
    }

    // ========== FARBWAHL ==========
    case 'farbe': {
      const whiteText = document.getElementById('color-1');
      const blackText = document.getElementById('color-2');
      
      if (!whiteText || !blackText) break; // wenn es das Element nicht gibt, nichts tun

      if (event.code === 'ArrowDown') {
        // Pfeil nach unten: "Schwarz" soll größer werden
        highlightText('color-2', whiteText, blackText);
        isColorSelected = true; 
      }

      if (event.code === 'ArrowUp') {
        // Pfeil nach oben: "Weiß" soll größer werden
        highlightText('color-1', whiteText, blackText);
        isColorSelected = true; 
      }

      if (event.code === 'Space'&& isColorSelected) {
        window.location.href = 'praesentation.html';
      }
      break;
    }

    // ========== DRUCK-VORSCHAU ==========
    case 'druck':
      if ((event.code === 'Space' || event.code === 'Enter') && !isPrinting) {
        isPrinting = true;
        startPrintAndRedirect();
      }
      break;

    // ========== GEDRUCKT-SCREEN ==========
    case 'done':
      if (event.code === 'Space') {
        window.location.href = 'startdisplay.html';
      }
      break;
  }
});

function startPrintAndRedirect() {
  const overlay = document.getElementById('print-overlay');
  if (overlay) {
    overlay.hidden = false;          // Overlay anzeigen
  }

  setTimeout(function () {
    window.location.href = 'gedruckt.html';
  }, 3000);                          // 3000 ms = 3 Sekunden
}

// Funktion zum Hervorheben eines Textes
function highlightText(id, oldElement1, oldElement2) {
  // Zurücksetzen der Schriftgröße des vorherigen Textes
  oldElement1.style.fontSize = '8rem';
  oldElement2.style.fontSize = '8rem';

  // Das neue Element hervorheben
  const newElement = document.getElementById(id);
  newElement.style.fontSize = '10rem'; // neue größere Größe
  
  highlightedText = id; // Tracken des aktuell hervorgehobenen Textes
}