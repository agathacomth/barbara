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

/* 2. Carrosséis do celular: pontinhos + passagem automática
      O deslizar continua sendo do próprio navegador (scroll-snap, no CSS),
      então o arrasto com o dedo funciona do mesmo jeito de sempre. O que este
      trecho acrescenta é uma passagem automática, só para mostrar que tem mais
      coisa para o lado, com quatro travas para não virar incômodo:

        1. só anda enquanto o bloco está na tela;
        2. para de vez no primeiro toque, arrasto, roda do mouse ou tecla;
        3. faz uma ida e uma volta e para, terminando no primeiro cartão;
        4. não anda para quem pediu menos movimento no sistema. */
(function () {
  'use strict';

  var SELETOR = '.grade--3, .duas-listas, .movs, .entregas-grade, .depoimentos:not(.depoimentos--bio), .mosaico, .duo, .trajetoria';
  var mq = window.matchMedia('(max-width: 899px)');
  var INTERVALO = 4000;   // tempo em cada cartão
  var montados = [];

  var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var podeObservar = 'IntersectionObserver' in window;

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

    var usuarioMexeu = false;   // uma vez verdadeiro, nunca mais anda sozinho
    var relogio = null;
    var sentido = 1;            // 1 vai, -1 volta
    var observador = null;

    function marcar() {
      var largura = trilho.scrollWidth / itens;
      var atual = Math.round(trilho.scrollLeft / largura);
      if (atual > itens - 1) atual = itens - 1;
      if (atual < 0) atual = 0;
      for (var i = 0; i < pontos.children.length; i++) {
        if (i === atual) pontos.children[i].setAttribute('data-ativo', '');
        else pontos.children[i].removeAttribute('data-ativo');
      }
      // A dica some no primeiro arrasto DA PESSOA. O movimento automático não
      // a esconde, senão a única instrução da tela sumiria sozinha.
      if (usuarioMexeu && trilho.scrollLeft > 12) dica.style.opacity = '0';
    }

    function parar() {
      if (relogio) { clearInterval(relogio); relogio = null; }
    }

    function assumirControle() {
      if (usuarioMexeu) return;
      usuarioMexeu = true;
      parar();
      if (observador) { observador.disconnect(); observador = null; }
      marcar();
    }

    function passo() {
      if (usuarioMexeu) return parar();
      var largura = trilho.scrollWidth / itens;
      var atual = Math.round(trilho.scrollLeft / largura);
      var prox = atual + sentido;
      if (prox > itens - 1) { sentido = -1; prox = itens - 2; }
      else if (prox < 0) { return parar(); }   // fechou a ida e a volta
      trilho.scrollTo({ left: Math.max(0, prox * largura), behavior: 'smooth' });
    }

    function tocar() {
      if (relogio || usuarioMexeu || menosMovimento) return;
      relogio = setInterval(passo, INTERVALO);
    }

    // Qualquer gesto da pessoa encerra o automático. Uso os eventos de entrada,
    // e não o evento de rolagem, porque a rolagem também dispara no movimento
    // automático e desligaria tudo no primeiro passo.
    ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(function (ev) {
      trilho.addEventListener(ev, assumirControle, { passive: true });
    });

    var esperando = false;
    trilho.addEventListener('scroll', function () {
      if (esperando) return;
      esperando = true;
      requestAnimationFrame(function () { marcar(); esperando = false; });
    }, { passive: true });

    // Só anda enquanto está na tela: fora dela seria movimento invisível e a
    // pessoa chegaria no bloco já no meio dos cartões.
    if (podeObservar && !menosMovimento) {
      observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) tocar(); else parar();
        });
      }, { threshold: 0.55 });
      observador.observe(trilho);
    }

    dica.style.transition = 'opacity .3s ease';
    trilho.dataset.pontos = '1';
    montados.push({ trilho: trilho, pontos: pontos, dica: dica, parar: parar, observador: function () { return observador; } });
    marcar();
  }

  function aplicar() {
    if (mq.matches) {
      document.querySelectorAll(SELETOR).forEach(montar);
    } else {
      montados.forEach(function (c) {
        c.parar();
        var obs = c.observador();
        if (obs) obs.disconnect();
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
