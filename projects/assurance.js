(function () {
  const els = {
    age: document.getElementById('age'),
    permis: document.getElementById('permis'),
    accidents: document.getElementById('accidents'),
    anciennete: document.getElementById('anciennete'),
    btn: document.getElementById('calcBtn'),
    resultBox: document.getElementById('resultBox'),
    tierBadge: document.getElementById('tierBadge'),
    breakdown: document.getElementById('breakdown')
  };

  const TIERS = {
    '-refuse': { label: 'Refusé', cls: 'tier-refuse' },
    0: { label: 'Tarif rouge', cls: 'tier-rouge' },
    1: { label: 'Tarif orange', cls: 'tier-orange' },
    2: { label: 'Tarif vert', cls: 'tier-vert' },
    3: { label: 'Tarif bleu', cls: 'tier-bleu' }
  };

  function calculate() {
    const age = Number(els.age.value);
    const permis = Number(els.permis.value);
    const accidents = Number(els.accidents.value);
    const anciennete = Number(els.anciennete.value);

    if ([els.age, els.permis, els.accidents, els.anciennete].some(el => el.value === '')) {
      els.tierBadge.className = 'tier-badge tier-refuse';
      els.tierBadge.textContent = 'Merci de remplir tous les champs';
      els.breakdown.innerHTML = '';
      els.resultBox.classList.add('show');
      return;
    }

    const steps = [];
    let points = 0;

    if (accidents >= 3) {
      els.tierBadge.className = 'tier-badge ' + TIERS['-refuse'].cls;
      els.tierBadge.textContent = TIERS['-refuse'].label;
      els.breakdown.innerHTML = `<span class="minus">3 accidents responsables ou plus → dossier automatiquement refusé.</span>`;
      els.resultBox.classList.add('show');
      return;
    }

    if (age > 25) { points += 1; steps.push('<span class="plus">+1</span> âge &gt; 25 ans'); }
    else { steps.push('+0 âge ≤ 25 ans'); }

    if (permis > 2) { points += 1; steps.push('<span class="plus">+1</span> permis &gt; 2 ans'); }
    else { steps.push('+0 permis ≤ 2 ans'); }

    if (anciennete > 5) { points += 1; steps.push('<span class="plus">+1</span> ancienneté assurance &gt; 5 ans'); }
    else { steps.push('+0 ancienneté assurance ≤ 5 ans'); }

    if (accidents > 0) { points -= accidents; steps.push(`<span class="minus">-${accidents}</span> accident(s) responsable(s)`); }

    points = Math.max(-1, Math.min(3, points));

    const tierKey = points < 0 ? '-refuse' : points;
    const tier = TIERS[tierKey];

    els.tierBadge.className = 'tier-badge ' + tier.cls;
    els.tierBadge.textContent = tier.label;
    els.breakdown.innerHTML = steps.map(s => `<span>${s}</span>`).join('') + `<span>Score final : <strong>${points}</strong></span>`;
    els.resultBox.classList.add('show');
  }

  els.btn.addEventListener('click', calculate);
})();
