(function () {
  const input = document.getElementById('nbCopies');
  const btn = document.getElementById('calcBtn');
  const resultBox = document.getElementById('resultBox');
  const resultValue = document.getElementById('resultValue');
  const breakdown = document.getElementById('breakdown');

  function fmt(v) {
    return v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function computePrice(n) {
    const steps = [];
    let price = 0;

    if (n <= 10) {
      price = n * 0.10;
      steps.push(`${n} copie(s) × 0,10€ = ${fmt(n * 0.10)}€`);
    } else if (n <= 30) {
      price = 1 + (n - 10) * 0.09;
      steps.push(`10 premières copies = 1,00€`);
      steps.push(`${n - 10} copie(s) × 0,09€ = ${fmt((n - 10) * 0.09)}€`);
    } else {
      price = 2.8 + (n - 30) * 0.08;
      steps.push(`30 premières copies = 2,80€`);
      steps.push(`${n - 30} copie(s) × 0,08€ = ${fmt((n - 30) * 0.08)}€`);
    }

    return { price, steps };
  }

  function calculate() {
    const n = Number(input.value);
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
      resultBox.classList.remove('show');
      breakdown.innerHTML = '<span class="minus">Entrez un nombre entier positif de photocopies.</span>';
      resultBox.classList.add('show');
      resultValue.textContent = '—';
      return;
    }

    const { price, steps } = computePrice(n);
    resultValue.textContent = price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    breakdown.innerHTML = steps.map(s => `<span>${s}</span>`).join('');
    resultBox.classList.add('show');
  }

  btn.addEventListener('click', calculate);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') calculate(); });
})();
