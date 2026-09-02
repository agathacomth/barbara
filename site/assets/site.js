/* Bárbara Germani — interações leves */
(function () {
  'use strict';

  // Revelar elementos ao rolar
  var alvos = document.querySelectorAll('.reveal');
  if (!alvos.length) return;

  if (!('IntersectionObserver' in window)) {
    alvos.forEach(function (el) { el.classList.add('visivel'); });
    return;
  }

  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visivel');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  alvos.forEach(function (el) { obs.observe(el); });
})();
