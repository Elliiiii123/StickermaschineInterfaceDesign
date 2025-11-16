console.log('steuerung.js geladen – Screen:', document.body.dataset.screen);

// Spruch-Liste für spruchwahl.html
const phrases = [
  'Spruch 1',
  'Spruch 2',
  'Spruch 3',
  'Spruch 4',
  'Spruch 5'
];

// Symbol-Liste für symbolwahl.html
const symbols = [
  'symbol1.png',
  'symbol2.png',
  'symbol3.png',
  'symbol4.png',
  'symbol5.png'
];
let currentSymbolIndex = 0;

let currentPhraseIndex = 0; // Start bei Spruch 1

// globaler Key-Listener für ALLE Seiten
document.addEventListener('keydown', function (event) {
  const screen = document.body.dataset.screen || 'unknown';

  // Space soll nicht scrollen
  if (event.code === 'Space' || event.key === ' ') {
    event.preventDefault();
  }

    // Pfeiltasten sollen auch nicht scrollen
  if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
    event.preventDefault();
  }

  switch (screen) {
    // ========== STARTSEITE ==========
    case 'start':
      if (event.code === 'Space') {
        window.location.href = 'modus.html';
      }
      break;

    // ========== MODUSWAHL ==========
    case 'mode':
      if (event.code === 'Space') {
        window.location.href = 'spruchwahl.html';
      }
      break;

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
    case 'farbe':
      if (event.code === 'Space') {
        window.location.href = 'praesentation.html';
      }
      break;

    // ========== DRUCK-VORSCHAU ==========
    case 'druck':
      if (event.code === 'Space') {
        window.location.href = 'gedruckt.html';
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