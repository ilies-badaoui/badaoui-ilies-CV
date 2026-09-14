(function () {
  const scanBtn = document.getElementById('yukaScanBtn');
  const overlay = document.getElementById('scannerOverlay');
  const closeBtn = document.getElementById('scannerClose');
  const status = document.getElementById('scannerStatus');
  const queryInput = document.getElementById('yukaQuery');
  const searchBtn = document.getElementById('yukaSearchBtn');

  if (!scanBtn) return;

  if (typeof Html5Qrcode === 'undefined') {
    scanBtn.disabled = true;
    scanBtn.title = 'Scanner indisponible (librairie non chargée)';
    return;
  }

  const BARCODE_FORMATS = [
    Html5QrcodeSupportedFormats.EAN_13,
    Html5QrcodeSupportedFormats.EAN_8,
    Html5QrcodeSupportedFormats.UPC_A,
    Html5QrcodeSupportedFormats.UPC_E,
    Html5QrcodeSupportedFormats.CODE_128,
    Html5QrcodeSupportedFormats.CODE_39,
    Html5QrcodeSupportedFormats.ITF,
    Html5QrcodeSupportedFormats.CODABAR
  ];

  let html5QrCode = null;
  let isScanning = false;

  function isSecureEnough() {
    return location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  }

  function onScanSuccess(decodedText) {
    closeScanner();
    queryInput.value = decodedText.replace(/\D/g, '') || decodedText;
    searchBtn.click();
  }

  function friendlyError(err) {
    const name = (err && err.name) || '';
    if (name === 'NotAllowedError') return "Accès à la caméra refusé. Autorisez la caméra dans les paramètres du navigateur puis réessayez.";
    if (name === 'NotFoundError' || name === 'OverconstrainedError') return "Aucune caméra détectée sur cet appareil.";
    return "Impossible de démarrer la caméra. Utilisez la recherche manuelle ci-dessous.";
  }

  function openScanner() {
    overlay.classList.add('show');

    if (!isSecureEnough()) {
      status.textContent = "Le scan caméra nécessite une connexion sécurisée (https). Il fonctionnera une fois le site en ligne sur GitHub Pages.";
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status.textContent = "Votre navigateur ne supporte pas l'accès à la caméra.";
      return;
    }

    status.textContent = 'Démarrage de la caméra…';

    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode('qrReader', { formatsToSupport: BARCODE_FORMATS, verbose: false });
    }

    html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 150 } },
      onScanSuccess,
      () => {}
    ).then(() => {
      isScanning = true;
      status.textContent = 'Visez le code-barres du produit…';
    }).catch((err) => {
      status.textContent = friendlyError(err);
    });
  }

  function closeScanner() {
    overlay.classList.remove('show');
    if (html5QrCode && isScanning) {
      html5QrCode.stop().then(() => html5QrCode.clear()).catch(() => {});
    }
    isScanning = false;
  }

  scanBtn.addEventListener('click', openScanner);
  closeBtn.addEventListener('click', closeScanner);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeScanner();
  });
})();
