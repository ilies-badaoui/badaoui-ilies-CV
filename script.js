(function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  // Scroll to top button
  var scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      scrollTopBtn.classList.toggle('show', window.scrollY > 500);
    });
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Dock nav active-section tracking
  var dockLinks = document.querySelectorAll('.dock a[data-section]');
  if (dockLinks.length && 'IntersectionObserver' in window) {
    var sectionEls = [];
    dockLinks.forEach(function (link) {
      var id = link.dataset.section;
      var el = id === 'top' ? document.getElementById('top') : document.getElementById(id);
      if (el) sectionEls.push({ id: id, el: el });
    });

    var setActive = function (id) {
      dockLinks.forEach(function (link) {
        link.classList.toggle('active', link.dataset.section === id);
      });
    };

    var sectionObserver = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (e) { return e.isIntersecting; });
      if (visible.length) {
        visible.sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
        var match = sectionEls.find(function (s) { return s.el === visible[0].target; });
        if (match) setActive(match.id);
      }
    }, { threshold: [0.2, 0.4, 0.6], rootMargin: '-15% 0px -55% 0px' });

    sectionEls.forEach(function (s) { sectionObserver.observe(s.el); });
    setActive('top');
  }
})();
