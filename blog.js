/* Blog: peças usadas pela página inicial (lista) e por postagem.html (leitor direto do Supabase).
   As postagens ficam na tabela psicanalise_posts (leitura pública só das publicadas). */
(function () {
  var SUPABASE_URL = 'https://wqkgsotfwkzjwaowenrb.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_p9Un5Po0_3kriGmSwOXIFQ_K8BCMLtt';

  function buscar(filtro) {
    return fetch(SUPABASE_URL + '/rest/v1/psicanalise_posts?' + filtro, { headers: { apikey: SUPABASE_KEY } })
      .then(function (r) { if (!r.ok) throw new Error('blog'); return r.json(); });
  }

  function el(tag, attrs, filhos) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k];
      else if (k === 'class') e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (filhos || []).forEach(function (f) { if (f) e.appendChild(f); });
    return e;
  }

  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  function dataExtenso(iso) {
    var d = new Date(iso);
    return isNaN(d) ? '' : d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear();
  }

  /* O texto da postagem é só isto: parágrafos separados por uma linha em branco e subtítulos marcados com "## " no começo da linha.
     Tudo entra como texto (textContent): nada digitado vira HTML. */
  function renderizarCorpo(corpo) {
    var saida = document.createDocumentFragment();
    String(corpo || '').replace(/\r\n?/g, '\n').split(/\n{2,}/).forEach(function (bloco) {
      bloco = bloco.trim();
      if (!bloco) return;
      var paragrafo = [];
      function fechar() {
        if (!paragrafo.length) return;
        var p = el('p', { class: 'blog-p' });
        paragrafo.forEach(function (l, i) { if (i) p.appendChild(document.createElement('br')); p.appendChild(document.createTextNode(l)); });
        saida.appendChild(p); paragrafo = [];
      }
      bloco.split('\n').forEach(function (l) {
        var m = /^##\s+(.+)$/.exec(l.trim());
        if (m) { fechar(); saida.appendChild(el('h2', { class: 'blog-h2', text: m[1] })); }
        else if (l.trim()) paragrafo.push(l.trim());
      });
      fechar();
    });
    return saida;
  }

  function resumoDe(post) {
    if (post.resumo) return post.resumo;
    var t = String(post.corpo || '').replace(/^##\s+/gm, '').replace(/\s+/g, ' ').trim();
    return t.length > 155 ? t.slice(0, 155).replace(/\s+\S*$/, '') + '…' : t;
  }

  function idYoutube(url) {
    try {
      var u = new URL(String(url || '').trim()), host = u.hostname.replace(/^www\.|^m\./, ''), id = null, m;
      if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
      else if (host === 'youtube.com') {
        if (u.pathname === '/watch') id = u.searchParams.get('v');
        else if ((m = /^\/(shorts|embed|live)\/([^/]+)/.exec(u.pathname))) id = m[2];
      }
      return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    } catch (e) { return null; }
  }

  function renderizarVideo(url) {
    var id = idYoutube(url), saida = document.createDocumentFragment();
    if (!id) return saida;
    var moldura = el('div', { class: 'blog-video' });
    moldura.appendChild(el('iframe', { src: 'https://www.youtube.com/embed/' + id, title: 'Vídeo no YouTube', loading: 'lazy', allowfullscreen: '', allow: 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen' }));
    saida.appendChild(moldura);
    saida.appendChild(el('p', { class: 'blog-p', style: 'text-align:center' }, [el('a', { class: 'blog-link', href: 'https://www.youtube.com/watch?v=' + id, target: '_blank', rel: 'noopener', text: 'Assistir no YouTube' })]));
    return saida;
  }

  /* endereço (slug) a partir de um texto: sem acento, minúsculo, hífens (a mesma regra do painel e do servidor) */
  function slugDe(t) { return String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, ''); }

  /* assuntos distintos (nomes que dão o mesmo endereço viram um só), em ordem alfabética */
  function agruparAssuntos(posts) {
    var mapa = {};
    posts.forEach(function (p) {
      var nome = String(p.assunto || '').trim(), slug = slugDe(nome);
      if (slug) (mapa[slug] = mapa[slug] || { nome: nome, slug: slug, posts: [] }).posts.push(p);
    });
    /* dentro do assunto, da mais antiga (a abertura) para a mais nova */
    Object.keys(mapa).forEach(function (k) { mapa[k].posts.sort(function (x, y) { return String(x.publicado_em || '').localeCompare(String(y.publicado_em || '')); }); });
    return Object.keys(mapa).sort().map(function (k) { return mapa[k]; });
  }

  function cartao(p) {
    return el('a', { class: 'postagem', href: 'blog/' + encodeURIComponent(p.slug) + '.html' }, [
      p.imagem_url ? el('img', { src: p.imagem_url, alt: '', loading: 'lazy' }) : null,
      p.publicado_em ? el('p', { class: 'blog-data', text: dataExtenso(p.publicado_em) }) : null,
      el('h3', { text: p.titulo })
    ]);
  }

  /* página inicial: um cartão por assunto (capa = a postagem mais antiga, a abertura); depois as postagens sem assunto */
  function listarPostagens(container) {
    buscar('publicado=eq.true&select=slug,titulo,assunto,imagem_url,publicado_em&order=publicado_em.desc').then(function (posts) {
      container.textContent = '';
      if (!posts.length) { container.appendChild(el('p', { text: 'Em breve, novos textos.' })); return; }
      agruparAssuntos(posts).forEach(function (a) {
        var capa = a.posts.filter(function (p) { return p.imagem_url; })[0];
        container.appendChild(el('a', { class: 'postagem', href: 'assunto/' + a.slug + '.html' }, [
          capa ? el('img', { src: capa.imagem_url, alt: '', loading: 'lazy' }) : null,
          el('h3', { text: a.nome }),
          el('p', { class: 'blog-data', text: a.posts.length === 1 ? '1 texto' : a.posts.length + ' textos' })
        ]));
      });
      posts.filter(function (p) { return !slugDe(String(p.assunto || '').trim()); }).forEach(function (p) { container.appendChild(cartao(p)); });
    }).catch(function () { container.textContent = ''; container.appendChild(el('p', { text: 'Não foi possível carregar os textos agora.' })); });
  }

  window.blog = {
    buscar: buscar, el: el, dataExtenso: dataExtenso, renderizarCorpo: renderizarCorpo, resumoDe: resumoDe,
    idYoutube: idYoutube, renderizarVideo: renderizarVideo, listarPostagens: listarPostagens, slugDe: slugDe, agruparAssuntos: agruparAssuntos, cartao: cartao
  };
})();
