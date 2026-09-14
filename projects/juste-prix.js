(function () {
  const OBJECTS = [
    { name: 'Nintendo 2DS', emoji: '🎮' },
    { name: 'Console Atari', emoji: '👾' },
    { name: 'Nintendo NES', emoji: '🕹️' },
    { name: 'PlayStation 1', emoji: '💿' },
    { name: 'Console rétro', emoji: '📼' },
    { name: 'Nintendo Switch', emoji: '🎮' }
  ];
  const MAX_TRIES = 10;

  const els = {
    badge: document.getElementById('objectBadge'),
    name: document.getElementById('objectName'),
    input: document.getElementById('guessInput'),
    btn: document.getElementById('guessBtn'),
    message: document.getElementById('ljpMessage'),
    triesLeft: document.getElementById('triesLeft'),
    history: document.getElementById('ljpHistory'),
    restart: document.getElementById('ljpRestart')
  };

  let mysteryPrice = 0;
  let triesRemaining = MAX_TRIES;
  let over = false;

  function newGame() {
    const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
    els.badge.textContent = obj.emoji;
    els.name.textContent = obj.name;
    mysteryPrice = Math.floor(Math.random() * 100) + 1;
    triesRemaining = MAX_TRIES;
    over = false;
    els.triesLeft.textContent = String(triesRemaining);
    els.message.textContent = 'Faites votre première proposition !';
    els.message.className = 'ljp-message';
    els.history.innerHTML = '';
    els.input.value = '';
    els.input.disabled = false;
    els.btn.disabled = false;
    els.restart.style.display = 'none';
  }

  function submitGuess() {
    if (over) return;
    const guess = Number(els.input.value);
    if (!guess || guess < 1 || guess > 100) {
      els.message.textContent = 'Entrez un prix valide entre 1 et 100€.';
      els.message.className = 'ljp-message down';
      return;
    }

    const chip = document.createElement('span');
    chip.textContent = guess + '€';
    els.history.appendChild(chip);

    if (guess === mysteryPrice) {
      els.message.textContent = `Bravo, vous avez gagné en ${MAX_TRIES - triesRemaining + 1} tentative(s) !`;
      els.message.className = 'ljp-message win';
      endGame();
      return;
    }

    triesRemaining--;
    els.triesLeft.textContent = String(triesRemaining);

    if (guess < mysteryPrice) {
      els.message.textContent = "C'est plus !";
      els.message.className = 'ljp-message up';
    } else {
      els.message.textContent = "C'est moins !";
      els.message.className = 'ljp-message down';
    }

    if (triesRemaining <= 0) {
      els.message.textContent = `Perdu… le juste prix était ${mysteryPrice}€.`;
      els.message.className = 'ljp-message lose';
      endGame();
    }

    els.input.value = '';
    els.input.focus();
  }

  function endGame() {
    over = true;
    els.input.disabled = true;
    els.btn.disabled = true;
    els.restart.style.display = 'inline-flex';
  }

  els.btn.addEventListener('click', submitGuess);
  els.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitGuess();
  });
  els.restart.addEventListener('click', newGame);

  newGame();
})();
