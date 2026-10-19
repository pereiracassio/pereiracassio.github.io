/* Páginas do blog: transforma uma postagem do Supabase numa página HTML pronta (uma por postagem) e monta o sitemap.
   Usado por api/blog-publicar.js. O "_" no começo do nome faz a Vercel NÃO tratar este arquivo como um endpoint. */

const SITE = 'https://pereiracassio.github.io';
const PAGINAS_FIXAS = ['', 'quem-sou-eu.html', 'sessoes.html'];
const LINK_AGENDAR = 'https://wa.me/message/M73L2KE2I4OYB1';

const esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const dataExtenso = (iso) => { const d = new Date(iso); return isNaN(d) ? '' : d.getUTCDate() + ' de ' + MESES[d.getUTCMonth()] + ' de ' + d.getUTCFullYear(); };

/* mesmas regras do blog.js do navegador: parágrafos separados por linha em branco, "## " no começo da linha = subtítulo */
function corpoHtml(corpo) {
  const saida = [];
  String(corpo || '').replace(/\r\n?/g, '\n').split(/\n{2,}/).forEach((bloco) => {
    bloco = bloco.trim();
    if (!bloco) return;
    let paragrafo = [];
    const fechar = () => { if (paragrafo.length) { saida.push('<p class="blog-p">' + paragrafo.map(esc).join('<br>') + '</p>'); paragrafo = []; } };
    bloco.split('\n').forEach((l) => {
      const m = /^##\s+(.+)$/.exec(l.trim());
      if (m) { fechar(); saida.push('<h2 class="blog-h2">' + esc(m[1]) + '</h2>'); }
      else if (l.trim()) paragrafo.push(l.trim());
    });
    fechar();
  });
  return saida.join('\n');
}

function resumoDe(p) {
  if (p.resumo) return p.resumo;
  const t = String(p.corpo || '').replace(/^##\s+/gm, '').replace(/\s+/g, ' ').trim();
  return t.length > 155 ? t.slice(0, 155).replace(/\s+\S*$/, '') + '…' : t;
}

/* id do vídeo a partir do link do YouTube; null se não for um link do YouTube */
function idYoutube(url) {
  try {
    const u = new URL(String(url || '').trim());
    const host = u.hostname.replace(/^www\.|^m\./, '');
    let id = null;
    if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
    else if (host === 'youtube.com') {
      if (u.pathname === '/watch') id = u.searchParams.get('v');
      else { const m = /^\/(shorts|embed|live)\/([^/]+)/.exec(u.pathname); if (m) id = m[2]; }
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch (e) { return null; }
}

function videoHtml(url) {
  const id = idYoutube(url);
  if (!id) return '';
  return '<div class="blog-video"><iframe src="https://www.youtube.com/embed/' + id + '" title="Vídeo no YouTube" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>\n' +
    '<p class="blog-p" style="text-align:center"><a class="blog-link" href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener">Assistir no YouTube</a></p>';
}

const enderecoPost = (slug) => SITE + '/blog/' + slug + '.html';
const enderecoAssunto = (slug) => SITE + '/assunto/' + slug + '.html';

/* endereço (slug) a partir de um texto: sem acento, minúsculo, hífens (a mesma regra do painel e do blog.js) */
const slugDe = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, '');

/* junta as postagens por assunto (um assunto por postagem); nomes que dão o mesmo endereço viram um só */
function agruparAssuntos(posts) {
  const mapa = {};
  posts.forEach((p) => {
    const nome = String(p.assunto || '').trim(), slug = slugDe(nome);
    if (!slug) return;
    (mapa[slug] = mapa[slug] || { nome, slug, posts: [] }).posts.push(p);
  });
  return Object.keys(mapa).sort().map((k) => mapa[k]);
}

/* casca comum das páginas geradas */
function casca({ titulo, descricao, url, tipo, extraHead, corpo }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(titulo)} | Cássio Pereira</title>
    <meta name="description" content="${esc(descricao)}">
    <link rel="canonical" href="${esc(url)}">
    <meta property="og:type" content="${tipo}">
    <meta property="og:title" content="${esc(titulo)}">
    <meta property="og:description" content="${esc(descricao)}">
    <meta property="og:url" content="${esc(url)}">${extraHead || ''}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Karla:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css?v=8">
</head>
<body>

    <header>
        <h1>Cássio Pereira</h1>
        <p>Psicanalista Clínico</p>
    </header>

    <nav>
        <a href="/index.html">Página inicial</a>
        <a href="/quem-sou-eu.html">Quem sou eu</a>
        <a href="/sessoes.html">Sessões de psicanálise</a>
    </nav>

    <main class="texto">
${corpo}
    </main>

    <footer>
        Cássio Pereira · Psicanalista Clínico
    </footer>

</body>
</html>
`;
}

/* página de um assunto: a lista das postagens dele */
function paginaAssunto(a) {
  const cartoes = a.posts.map((p) => '        <a class="postagem" href="/blog/' + p.slug + '.html">' +
    (p.imagem_url ? '<img src="' + esc(p.imagem_url) + '" alt="" loading="lazy">' : '') +
    (p.publicado_em ? '<p class="blog-data">' + esc(dataExtenso(p.publicado_em)) + '</p>' : '') +
    '<h3>' + esc(p.titulo) + '</h3></a>').join('\n');
  return casca({
    titulo: a.nome, descricao: 'Textos sobre ' + a.nome + ' na psicanálise, por Cássio Pereira.', url: enderecoAssunto(a.slug), tipo: 'website',
    corpo: `        <h1 class="pagina">${esc(a.nome)}</h1>
        <div class="postagens">
${cartoes}
        </div>
        <a class="blog-voltar" href="/index.html">← Ver todos os textos</a>`
  });
}

function paginaPost(p) {
  const url = enderecoPost(p.slug), resumo = resumoDe(p);
  const ld = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.titulo, description: resumo,
    datePublished: p.publicado_em, dateModified: p.atualizado_em || p.publicado_em, mainEntityOfPage: url,
    author: { '@type': 'Person', name: 'Cássio Pereira' }
  };
  if (p.imagem_url) ld.image = p.imagem_url;
  const ldJson = JSON.stringify(ld).replace(/</g, '\\u003c');
  const assunto = String(p.assunto || '').trim(), slugAssunto = slugDe(assunto);
  return casca({
    titulo: p.titulo, descricao: resumo, url, tipo: 'article',
    extraHead: (p.imagem_url ? '\n    <meta property="og:image" content="' + esc(p.imagem_url) + '">' : '') + '\n    <script type="application/ld+json">' + ldJson + '</script>',
    corpo: `        ${slugAssunto ? '<a class="assunto-post" href="/assunto/' + slugAssunto + '.html">' + esc(assunto) + '</a>' : ''}
        <h1 class="pagina">${esc(p.titulo)}</h1>
        ${p.publicado_em ? '<p class="blog-data">' + esc(dataExtenso(p.publicado_em)) + '</p>' : ''}
        ${p.imagem_url ? '<img class="blog-capa" src="' + esc(p.imagem_url) + '" alt="' + esc(p.titulo) + '">' : ''}
${corpoHtml(p.corpo)}
${videoHtml(p.video_url)}
        <div class="blog-fim"><a class="blog-botao" href="${LINK_AGENDAR}" target="_blank" rel="noopener">Agendar uma sessão</a></div>
        <a class="blog-voltar" href="${slugAssunto ? '/assunto/' + slugAssunto + '.html' : '/index.html'}">← ${slugAssunto ? 'Mais textos de ' + esc(assunto) : 'Ver todos os textos'}</a>`
  });
}

function sitemap(posts, assuntos) {
  const itens = PAGINAS_FIXAS.map((c) => '  <url><loc>' + SITE + '/' + c + '</loc></url>')
    .concat(assuntos.map((a) => '  <url><loc>' + esc(enderecoAssunto(a.slug)) + '</loc></url>'))
    .concat(posts.map((p) => '  <url><loc>' + esc(enderecoPost(p.slug)) + '</loc><lastmod>' + esc(String(p.atualizado_em || p.publicado_em || '').slice(0, 10)) + '</lastmod></url>'));
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + itens.join('\n') + '\n</urlset>\n';
}

module.exports = { paginaPost, paginaAssunto, agruparAssuntos, sitemap, slugDe, SITE };
