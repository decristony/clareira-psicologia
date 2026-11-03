(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = document.querySelector('.top'), hero = document.querySelector('.hero');
  const img = hero.querySelector('.hero-img'), win = hero.querySelector('.win');
  const mb = document.querySelector('.menu-btn'), mm = document.getElementById('menu-m');
  mb.addEventListener('click', () => { const o = mm.hidden; mm.hidden = !o; mb.setAttribute('aria-expanded', o); top.classList.add('solid'); });
  mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mm.hidden = true));

  // janela: a palavra mostra a foto nítida, alinhada pixel a pixel com a foto de fundo
  const supportsClip = CSS.supports('background-clip', 'text') || CSS.supports('-webkit-background-clip', 'text');
  if (!supportsClip) document.documentElement.classList.add('no-clip');
  const align = () => {
    const src = img.currentSrc || img.src; if (!img.naturalWidth) return;
    const hr = hero.getBoundingClientRect(), wr = win.getBoundingClientRect();
    const ir = img.naturalWidth / img.naturalHeight, W = hr.width, H = hr.height;
    let w, h; if (W / H > ir) { w = W; h = W / ir; } else { h = H; w = H * ir; }
    const ox = (W - w) / 2, oy = (H - h) / 2;
    win.style.backgroundImage = `url("${src}")`;
    win.style.backgroundSize = `${w}px ${h}px`;
    win.style.backgroundPosition = `${ox - (wr.left - hr.left)}px ${oy - (wr.top - hr.top)}px`;
  };
  const ready = () => { align(); hero.classList.add('ready'); };
  if (img.complete && img.naturalWidth) ready(); else img.addEventListener('load', ready, { once: true });
  addEventListener('resize', align);
  document.fonts && document.fonts.ready.then(align);

  // a névoa abre com a rolagem (até 35% de opacidade, para o texto continuar legível)
  const onScroll = () => {
    const p = Math.min(1, Math.max(0, scrollY / (hero.offsetHeight * 0.6)));
    hero.style.setProperty('--fog', (1 - p * 0.65).toFixed(3));
    top.classList.toggle('solid', scrollY > hero.offsetHeight * 0.75);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // linhas de atendimento
  const rows = [...document.querySelectorAll('.row')];
  rows.forEach(r => r.querySelector('.row-h').addEventListener('click', () => {
    const open = !r.classList.contains('open');
    rows.forEach(x => { x.classList.remove('open'); x.querySelector('.row-h').setAttribute('aria-expanded', 'false'); });
    if (open) { r.classList.add('open'); r.querySelector('.row-h').setAttribute('aria-expanded', 'true'); }
  }));

  // bússola
  const R = {
    'eu-ansiedade': ['s-individual', 'Psicoterapia individual · TCC', 'Sessões com técnicas para reconhecer e desarmar o ciclo da ansiedade, e tarefas curtas entre os encontros.'],
    'eu-luto': ['s-grupos', 'Individual + grupo de luto', 'Começar sozinho, com tempo para a perda, e depois entrar no grupo de doze encontros, se fizer sentido.'],
    'eu-foco': ['s-neuro', 'Avaliação neuropsicológica', 'Testes de atenção, memória e funções executivas, com laudo e uma sessão para explicar os resultados.'],
    'eu-relacao': ['s-individual', 'Psicoterapia individual · psicanálise', 'Espaço para entender por que certas histórias se repetem nas suas relações.'],
    'filho-ansiedade': ['s-adolescentes', 'Adolescentes · individual', 'Sessões só do adolescente, com encontros de orientação para os responsáveis a cada dois meses.'],
    'filho-luto': ['s-adolescentes', 'Adolescentes · individual', 'Um espaço só dele para falar da perda, sem precisar proteger a família do que sente.'],
    'filho-foco': ['s-neuro', 'Avaliação neuropsicológica', 'Investigação de TDAH e dificuldades de aprendizagem, com devolutiva para a família e a escola.'],
    'filho-relacao': ['s-adolescentes', 'Adolescentes · grupo', 'Grupo de jovens às quartas: conversa entre pares, com mediação de uma psicóloga.'],
    'casal': ['s-casal', 'Terapia de casal', 'Encontros de 80 minutos para olhar o padrão que se repete entre vocês, sem procurar culpado.']
  };
  const nivel = document.getElementById('nivel'), out = document.getElementById('nv');
  const upd = () => {
    const q = document.querySelector('input[name=quem]:checked').value, t = document.querySelector('input[name=tema]:checked').value;
    const r = R[q === 'casal' ? 'casal' : q + '-' + t];
    const n = +nivel.value; out.textContent = n;
    const im = document.getElementById('r-img'); const s = `assets/${r[0]}-${r[0] === 's-casal' ? 739 : 760}.webp`;
    if (!im.src.endsWith(s)) { im.style.opacity = 0; setTimeout(() => { im.src = s; im.onload = () => im.style.opacity = 1; }, reduce ? 0 : 200); }
    document.getElementById('r-t').textContent = r[1];
    document.getElementById('r-d').textContent = r[2];
    document.getElementById('r-f').textContent = 'Frequência sugerida: ' + (q === 'casal' ? 'quinzenal' : n >= 7 ? 'duas vezes por semana no primeiro mês' : n >= 3 ? 'semanal' : 'quinzenal');
    document.getElementById('r-alert').hidden = n < 9;
  };
  document.querySelectorAll('.bussola input').forEach(i => i.addEventListener('input', upd)); upd();

  if (!reduce && 'IntersectionObserver' in window) {
    const els = document.querySelectorAll('.head, .txt, .det, .split-txt, .bus-r, .weeks li, .team figure, .notes p');
    els.forEach(e => e.classList.add('reveal'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(e => io.observe(e));
  }
})();
