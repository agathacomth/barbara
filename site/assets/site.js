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

/* 3. SELETOR DE PALETA  ·  FERRAMENTA DE DECISÃO, NÃO É PARA FICAR NO AR
      -------------------------------------------------------------------
      Desenha o botão no canto inferior esquerdo, troca o atributo data-paleta
      do <html> e guarda a escolha, para que ela se mantenha ao navegar entre
      as páginas. Todas as cores do site saem de variáveis no style.css, então
      a troca é instantânea e vale para as quatro páginas.

      PARA REMOVER depois que a Bárbara escolher:
        1. apague este bloco inteiro (do comentário até o fim do arquivo);
        2. no style.css, copie as linhas da paleta escolhida para dentro
           do :root, por cima dos valores que estiverem lá;
        3. apague o bloco "PALETAS ALTERNATIVAS" e o bloco ".seletor-paleta".
      -------------------------------------------------------------------- */
(function () {
  'use strict';

  var CHAVE = 'bg-paleta';
  var PALETAS = [
    { id: '',          nome: 'Atual',               desc: 'Azul quase preto e rosa escurecido', cores: ['#020A1C', '#6D1330', '#8FB0DE', '#E9E8E9'] },
    { id: 'noturna',   nome: 'Autoridade Noturna',  desc: 'Azul oficial com o dourado do livro', cores: ['#001F54', '#C9A45C', '#0B1426', '#E9E8E9'] },
    { id: 'cafe',      nome: 'Café com Clareza',    desc: 'Terrosos quentes, sem rosa',          cores: ['#1E1A17', '#C8A27A', '#5A3E2B', '#F3EEE7'] },
    { id: 'manual',    nome: 'Manual Atualizado',   desc: 'O magenta do manual, só nos detalhes',cores: ['#001F54', '#B42150', '#E8C4CC', '#E9E8E9'] },
    { id: 'editorial', nome: 'Editorial do Livro',  desc: 'Preto suave e dourado',               cores: ['#141414', '#C9A45C', '#E6D3B3', '#E9E8E9'] },
    { id: 'bordo',     nome: 'Bordô Maduro',        desc: 'Magenta profundo com azul de apoio',  cores: ['#7A1F3D', '#001F54', '#D9B8AE', '#E9E8E9'] }
  ];

  function lerEscolha() {
    try { return localStorage.getItem(CHAVE) || ''; } catch (e) { return ''; }
  }
  function guardarEscolha(id) {
    try { localStorage.setItem(CHAVE, id); } catch (e) { /* navegação privada: vale só nesta página */ }
  }
  function aplicar(id) {
    if (id) document.documentElement.setAttribute('data-paleta', id);
    else document.documentElement.removeAttribute('data-paleta');
  }

  aplicar(lerEscolha());

  var caixa = document.createElement('div');
  caixa.className = 'seletor-paleta';
  caixa.innerHTML =
    '<button class="seletor-paleta__abre" type="button" aria-expanded="false">' +
      '<span class="seletor-paleta__disco" aria-hidden="true"></span>' +
      '<span>Cores</span>' +
    '</button>' +
    '<div class="seletor-paleta__painel" hidden>' +
      '<p class="seletor-paleta__titulo">Escolha a paleta</p>' +
      '<div class="seletor-paleta__lista"></div>' +
      '<p class="seletor-paleta__nota">Vale para as quatro páginas. Isto é só para decidir: some do site depois da escolha.</p>' +
    '</div>';

  var abre   = caixa.querySelector('.seletor-paleta__abre');
  var painel = caixa.querySelector('.seletor-paleta__painel');
  var lista  = caixa.querySelector('.seletor-paleta__lista');

  PALETAS.forEach(function (pal) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'seletor-paleta__item';
    b.dataset.id = pal.id;
    b.innerHTML =
      '<span class="seletor-paleta__amostras" aria-hidden="true">' +
        pal.cores.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') +
      '</span>' +
      '<span class="seletor-paleta__texto"><b>' + pal.nome + '</b><span>' + pal.desc + '</span></span>';
    b.addEventListener('click', function () {
      aplicar(pal.id);
      guardarEscolha(pal.id);
      marcarAtiva(pal.id);
    });
    lista.appendChild(b);
  });

  function marcarAtiva(id) {
    lista.querySelectorAll('.seletor-paleta__item').forEach(function (b) {
      if (b.dataset.id === id) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  }

  function abrirFechar(forcar) {
    var aberto = typeof forcar === 'boolean' ? forcar : painel.hidden;
    painel.hidden = !aberto;
    abre.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    caixa.classList.toggle('esta-aberto', aberto);
  }

  abre.addEventListener('click', function () { abrirFechar(); });
  document.addEventListener('click', function (e) {
    if (!caixa.contains(e.target)) abrirFechar(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') abrirFechar(false);
  });

  marcarAtiva(lerEscolha());
  document.body.appendChild(caixa);
})();
