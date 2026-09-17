/* Bárbara Germani — interações leves */

/* 1. Revelar elementos ao rolar */
(function () {
  'use strict';

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

/* 2. Pontinhos dos carrosséis do celular
      O deslizar é do próprio navegador (scroll-snap, no CSS). Este trecho só
      desenha os pontos e acompanha qual cartão está na frente, para a pessoa
      saber que tem mais coisa para o lado. */
(function () {
  'use strict';

  var SELETOR = '.grade--3, .duas-listas, .movs, .entregas-grade, .depoimentos:not(.depoimentos--bio), .mosaico, .duo, .trajetoria';
  var mq = window.matchMedia('(max-width: 899px)');
  var montados = [];

  function montar(trilho) {
    if (trilho.dataset.pontos) return;
    var itens = trilho.children.length;
    if (itens < 2) return;

    var pontos = document.createElement('ul');
    pontos.className = 'carrossel-pontos';
    pontos.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < itens; i++) pontos.appendChild(document.createElement('li'));
    trilho.insertAdjacentElement('afterend', pontos);

    var dica = document.createElement('span');
    dica.className = 'carrossel-dica';
    dica.textContent = 'Arraste para o lado';
    pontos.insertAdjacentElement('afterend', dica);

    function marcar() {
      var largura = trilho.scrollWidth / itens;
      var atual = Math.round(trilho.scrollLeft / largura);
      if (atual > itens - 1) atual = itens - 1;
      if (atual < 0) atual = 0;
      for (var i = 0; i < pontos.children.length; i++) {
        if (i === atual) pontos.children[i].setAttribute('data-ativo', '');
        else pontos.children[i].removeAttribute('data-ativo');
      }
      // a dica some depois do primeiro arrasto
      if (trilho.scrollLeft > 12) dica.style.opacity = '0';
    }

    var esperando = false;
    trilho.addEventListener('scroll', function () {
      if (esperando) return;
      esperando = true;
      requestAnimationFrame(function () { marcar(); esperando = false; });
    }, { passive: true });

    dica.style.transition = 'opacity .3s ease';
    trilho.dataset.pontos = '1';
    montados.push({ trilho: trilho, pontos: pontos, dica: dica });
    marcar();
  }

  function aplicar() {
    if (mq.matches) {
      document.querySelectorAll(SELETOR).forEach(montar);
    } else {
      montados.forEach(function (c) {
        c.pontos.remove();
        c.dica.remove();
        delete c.trilho.dataset.pontos;
      });
      montados = [];
    }
  }

  aplicar();
  if (mq.addEventListener) mq.addEventListener('change', aplicar);
  else if (mq.addListener) mq.addListener(aplicar);
})();
