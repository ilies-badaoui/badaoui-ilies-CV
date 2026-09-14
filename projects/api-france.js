(function () {
  const input = document.getElementById('adresse');
  const cpInput = document.getElementById('cp');
  const villeInput = document.getElementById('ville');
  const suggestions = document.getElementById('suggestions');
  const status = document.getElementById('status');
  const addrResult = document.getElementById('addrResult');
  const addrLabel = document.getElementById('addrLabel');
  const addrDetails = document.getElementById('addrDetails');

  let debounceTimer = null;
  let controller = null;

  function debounce(fn, delay) {
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fn(...args), delay);
    };
  }

  async function search(query) {
    if (!query || query.length < 3) {
      suggestions.classList.remove('show');
      status.textContent = '';
      return;
    }

    if (controller) controller.abort();
    controller = new AbortController();

    status.textContent = 'Recherche…';

    try {
      const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=6`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error('Réponse invalide de l\'API');
      const data = await res.json();
      renderSuggestions(data.features || []);
      status.textContent = data.features.length ? '' : 'Aucune adresse trouvée.';
    } catch (err) {
      if (err.name === 'AbortError') return;
      status.textContent = "Impossible de contacter l'API pour le moment.";
      suggestions.classList.remove('show');
    }
  }

  function renderSuggestions(features) {
    if (!features.length) {
      suggestions.classList.remove('show');
      return;
    }
    suggestions.innerHTML = features.map((f, i) => `<div data-index="${i}">${f.properties.label}</div>`).join('');
    suggestions.classList.add('show');
    suggestions._features = features;
  }

  function selectFeature(feature) {
    const p = feature.properties;
    input.value = p.label;
    cpInput.value = p.postcode || '';
    villeInput.value = p.city || '';
    suggestions.classList.remove('show');
    status.textContent = '';

    addrLabel.textContent = p.label;
    const coords = feature.geometry && feature.geometry.coordinates ? feature.geometry.coordinates : null;
    const parts = [];
    if (p.context) parts.push(p.context);
    if (coords) parts.push(`Coordonnées : ${coords[1].toFixed(5)}, ${coords[0].toFixed(5)}`);
    if (typeof p.score === 'number') parts.push(`Pertinence : ${Math.round(p.score * 100)}%`);
    addrDetails.innerHTML = parts.join(' · ');
    addrResult.classList.add('show');
  }

  input.addEventListener('input', debounce((e) => search(e.target.value.trim()), 350));

  suggestions.addEventListener('click', (e) => {
    const row = e.target.closest('div[data-index]');
    if (!row) return;
    const feature = suggestions._features[Number(row.dataset.index)];
    if (feature) selectFeature(feature);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.addr-field')) {
      suggestions.classList.remove('show');
    }
  });
})();
