(function () {
  const els = {
    query: document.getElementById('yukaQuery'),
    searchBtn: document.getElementById('yukaSearchBtn'),
    loading: document.getElementById('yukaLoading'),
    error: document.getElementById('yukaError'),
    result: document.getElementById('yukaResult'),
    img: document.getElementById('yukaImg'),
    name: document.getElementById('yukaName'),
    brand: document.getElementById('yukaBrand'),
    nutriGrade: document.getElementById('nutriGrade'),
    novaGrade: document.getElementById('novaGrade'),
    ecoGrade: document.getElementById('ecoGrade'),
    additivesTitle: document.getElementById('additivesTitle'),
    additivesTags: document.getElementById('additivesTags')
  };

  const NOVA_LABELS = {
    1: 'Peu transformé',
    2: 'Ingrédient culinaire',
    3: 'Transformé',
    4: 'Ultra-transformé'
  };

  function resetPanels() {
    els.error.classList.remove('show');
    els.result.classList.remove('show');
  }

  function setLoading(isLoading) {
    els.loading.classList.toggle('show', isLoading);
  }

  function showError(msg) {
    els.error.textContent = msg;
    els.error.classList.add('show');
  }

  function gradeClass(prefix, grade) {
    const g = (grade || 'na').toLowerCase();
    return `${prefix} ${['a', 'b', 'c', 'd', 'e'].includes(g) ? 'nutri-' + g : 'nutri-na'}`;
  }

  function displayProduct(product) {
    els.img.src = product.image_front_small_url || product.image_url || '';
    els.img.alt = product.product_name || 'Produit';
    els.name.textContent = product.product_name || 'Nom inconnu';
    els.brand.textContent = [product.brands, product.quantity].filter(Boolean).join(' · ') || 'Marque inconnue';

    const nutri = (product.nutriscore_grade || '').toUpperCase();
    els.nutriGrade.textContent = nutri && nutri !== 'UNKNOWN' ? nutri : '?';
    els.nutriGrade.className = gradeClass('grade', nutri);

    const nova = product.nova_group;
    els.novaGrade.textContent = nova ? nova : '?';
    els.novaGrade.parentElement.querySelector('.label').textContent = nova ? NOVA_LABELS[nova] || 'Groupe NOVA' : 'Groupe NOVA';
    els.novaGrade.className = 'grade ' + (nova ? 'nutri-' + ['a', 'a', 'c', 'e'][nova - 1] : 'nutri-na');

    const eco = (product.ecoscore_grade || '').toUpperCase();
    els.ecoGrade.textContent = eco && eco !== 'UNKNOWN' && eco !== 'NOT-APPLICABLE' ? eco : '?';
    els.ecoGrade.className = gradeClass('grade', eco);

    const additives = product.additives_tags || [];
    if (additives.length) {
      els.additivesTitle.textContent = `Additifs (${additives.length})`;
      els.additivesTags.innerHTML = additives.map(a => {
        const code = a.replace('en:', '').toUpperCase();
        return `<span>${code}</span>`;
      }).join('');
    } else {
      els.additivesTitle.textContent = 'Additifs';
      els.additivesTags.innerHTML = '<span>Aucun additif détecté</span>';
    }

    els.result.classList.add('show');
  }

  async function fetchByBarcode(code) {
    setLoading(true);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json`);
      const data = await res.json();
      if (data.status !== 1) {
        showError("Produit introuvable pour ce code-barres.");
        return;
      }
      displayProduct(data.product);
    } catch (e) {
      showError("Impossible de contacter Open Food Facts pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  function runSearch() {
    const term = els.query.value.trim();
    if (!term) return;
    resetPanels();

    if (/^\d{8,14}$/.test(term)) {
      fetchByBarcode(term);
    } else {
      showError("Merci d'entrer un code-barres valide (8 à 14 chiffres), ou d'utiliser un des exemples ci-dessous.");
    }
  }

  els.searchBtn.addEventListener('click', runSearch);
  els.query.addEventListener('keydown', (e) => { if (e.key === 'Enter') runSearch(); });

  document.querySelectorAll('.yuka-examples button').forEach(btn => {
    btn.addEventListener('click', () => {
      els.query.value = btn.dataset.q;
      runSearch();
    });
  });
})();
