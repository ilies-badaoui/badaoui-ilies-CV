(function () {
  const WORDS = [
    'ADMINISTRATIVE', 'CAPITALISATION', 'STATIONNEMENTS', 'FONCTIONNARISE',
    'HISTORIQUEMENT', 'JUDICIAIREMENT', 'LIBERALISATION', 'NUTRITIONNISTE',
    'RAVITAILLEMENT', 'THERMOMETRIQUE', 'MARIONNETTISTE', 'PALEOBOTANIQUE',
    'DEVELOPPEMENT', 'ORDINATEUR', 'JAVASCRIPT', 'ALGORITHME', 'PORTFOLIO'
  ];
  const MAX_ERRORS = 8;

  const els = {
    wordDisplay: document.getElementById('wordDisplay'),
    keyboard: document.getElementById('keyboard'),
    wrongCount: document.getElementById('wrongCount'),
    overlay: document.getElementById('gameOverlay'),
    overlayTitle: document.getElementById('overlayTitle'),
    overlayText: document.getElementById('overlayText'),
    restartBtn: document.getElementById('restartBtn'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    parts: document.querySelectorAll('.part')
  };

  let word = '';
  let guessed = new Set();
  let wrongCount = 0;
  let over = false;

  function pickWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }

  function newGame() {
    word = pickWord();
    guessed = new Set([word[0], word[word.length - 1]]);
    wrongCount = 0;
    over = false;
    els.overlay.classList.remove('show');
    els.parts.forEach(p => p.classList.remove('shown'));
    els.wrongCount.textContent = '0';
    renderWord();
    renderKeyboard();
  }

  function renderWord() {
    els.wordDisplay.innerHTML = word.split('').map(letter => {
      const shown = guessed.has(letter);
      return `<li class="${shown ? 'filled' : ''}">${shown ? letter : ''}</li>`;
    }).join('');
  }

  function renderKeyboard() {
    const letters = 'AZERTYUIOPQSDFGHJKLMWXCVBN'.split('');
    els.keyboard.innerHTML = letters.map(letter => {
      let cls = '';
      if (guessed.has(letter)) {
        cls = word.includes(letter) ? 'correct disabled' : 'wrong disabled';
      }
      return `<li data-letter="${letter}" class="${cls}">${letter}</li>`;
    }).join('');
  }

  function guessLetter(letter) {
    if (over || guessed.has(letter)) return;
    guessed.add(letter);

    if (word.includes(letter)) {
      renderWord();
      renderKeyboard();
      if (word.split('').every(l => guessed.has(l))) {
        win();
      }
    } else {
      wrongCount++;
      els.wrongCount.textContent = String(wrongCount);
      if (els.parts[wrongCount - 1]) els.parts[wrongCount - 1].classList.add('shown');
      renderKeyboard();
      if (wrongCount >= MAX_ERRORS) {
        lose();
      }
    }
  }

  function win() {
    over = true;
    els.overlayTitle.textContent = 'Gagné !';
    els.overlayText.textContent = `Le mot était bien "${word}".`;
    els.overlay.classList.add('show');
  }

  function lose() {
    over = true;
    els.parts.forEach(p => p.classList.add('shown'));
    word.split('').forEach(l => guessed.add(l));
    renderWord();
    els.overlayTitle.textContent = 'Perdu…';
    els.overlayText.textContent = `Le mot était "${word}".`;
    els.overlay.classList.add('show');
  }

  els.keyboard.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-letter]');
    if (li) guessLetter(li.dataset.letter);
  });

  document.addEventListener('keydown', (e) => {
    const letter = e.key.toUpperCase();
    if (letter.length === 1 && letter >= 'A' && letter <= 'Z') {
      guessLetter(letter);
    }
  });

  els.restartBtn.addEventListener('click', newGame);
  els.playAgainBtn.addEventListener('click', newGame);

  newGame();
})();
