# Notas para trabalhar neste repositório (site de Cássio Pereira, psicanalista)

Site e blog de psicanálise em `https://pereiracassio.github.io` (GitHub Pages). Foi feito nos moldes do blog do Falando de Astrologia
(repositório `pereiracassio/falandodeastrologia`), só que bem mais simples. Quando houver domínio próprio, basta apontá-lo para este repositório.

## Como conversar com o astrólogo/psicanalista (ele é o Cássio, mesma pessoa dos outros sites)

- **Respostas curtas e UMA pergunta por vez.** Ele se perde com listas de perguntas e explicações longas.
- **Só publicar na `main` quando ele pedir, a cada vez** (`git push origin <branch>:main`). Um "pode publicar" vale para aquela mudança só.
- Ele **não vê** avisos internos do sistema (o aviso do hook de git sobre "commit sem branch remota" é um alarme falso, porque olha os outros repositórios da sessão). Não repetir esse aviso para ele.
- SQL do Supabase e links de painéis: **sempre escritos na conversa**, para ele copiar e rodar. Ele não enxerga branches, só o que está na `main`.
- Visual (**mudou em 20/10/2026**): o **fundo do site é creme `#DDC591`** (`--fundo`), não branco. Cabeçalho, **menu e rodapé são PRETOS** (`--escuro`) com textos, logo e ícones em **creme**; o roxo (`--roxo` `#4b2a7b`) fica só nos destaques sobre o creme (títulos, botões, links do texto). Fontes **Fraunces** (títulos) e **Karla** (texto), escolhidas por ele (03 de quatro opções). Nada de traço/sublinhado enfeitando o título (ele detestou o que veio do Blogger).
- **REGRA DE PADRÃO (19/10/2026): títulos E subtítulos de página/texto são sempre ROXO** (`var(--roxo)`): `h1.pagina`, `.texto h2`, `.texto h3`, `.blog-h2`. Toda página nova segue isso, sem exceção. Texto corrido fica preto.
- **Nada branco (20/10/2026):** o que era branco passou para o creme (`var(--fundo)`); o roxo claro (`--roxo-claro`, hover) NÃO foi trocado. **Por que o fundo da página (`body`) é preto e só `main` é creme:** o Safari do iPhone pinta a barra de cima com o fundo do `body`; com o `body` creme a barra ficava creme. `body > main` leva `box-shadow` + `clip-path` para o creme ir de ponta a ponta mesmo com a coluna estreita. `<meta name="theme-color" content="#16151a">` em todas as páginas. Página nova: `body` = flex em coluna, com `header`, `nav`, `main` e `footer` como filhos diretos.
- **Favicon:** o divã do logo do canal de YouTube "Divã Pop" (só o desenho, sem o texto, que não se lê em 16px), traço roxo-claro sobre fundo escuro arredondado (`favicon.png` 512, `favicon-32.png`, `favicon-48.png`, `favicon.ico`, `apple-touch-icon.png`). Todas as páginas e o `api/_blog.js` apontam para eles com `?v=1`. O logo "Divã Pop" é definitivo (o canal é de psicanálise em linguagem popular, também para o público gay). Não foi preciso SVG.
- **Logo no cabeçalho:** `logo-diva-pop-creme.png` (divã + "Divã Pop" em creme, fundo transparente; o `logo-diva-pop.png` roxo claro ficou no repositório mas não é mais usado) no canto esquerdo em tela larga (≥860px) e centralizado acima do nome no celular (`.logo-cab` em `style.css`). Está no cabeçalho de todas as páginas e de `api/_blog.js`; página nova copia o mesmo bloco `<a class="logo-cab">`.
- **Cabeçalho:** grande só na página inicial; as internas (`sessoes`, `quem-sou-eu`, `postagem`, `assunto`, `admin` e as geradas por `api/_blog.js`) usam `<header class="compacto">` (faixa baixa, logo pequeno à esquerda). Página nova interna = `header.compacto`. A futura página do link da bio também deve ser enxuta (ele pediu).
- **Redes sociais:** ícones **creme no rodapé preto** (`img/rede-*-creme.svg`) e roxos no topo da bio (`img/rede-*.svg`), vindos do Falando de Astrologia sem o efeito de tinta) no rodapé de TODAS as páginas e das postagens geradas (`.redes`): Instagram `@pereira.cassio_`, TikTok `@pereira.cassio_`, YouTube `@cassiopereiraterapeuta`, WhatsApp 5511970404508 (mensagem pronta sobre sessões de psicanálise). Página nova copia o bloco `<div class="redes">` do rodapé.
- **Link da bio:** `bio.html` (noindex, cabeçalho enxuto, sem menu): redes no topo, texto de apresentação e das sessões, botão de WhatsApp roxo e link para o blog novo. **Bio curta (decisão dele, 20/10/2026):** redes no topo, UM parágrafo de apresentação e três botões (WhatsApp, Como funcionam as sessões, Conheça o blog). Sem valor da sessão (o preço fica só em `sessoes.html`) e sem texto longo: quem vem do Instagram, no celular, quer os botões sem rolar. O Instagram de psicanálise aponta para `https://pereiracassio.github.io/bio.html`.
- O nome do cabeçalho ("Cássio Pereira") é link para a página inicial. O nome do projeto é "Cássio Pereira, Psicanalista Clínico". O cabeçalho do Blogger tinha uma foto e o desenho do divã ("Divã Pop"); ainda não foram trazidos (as imagens estão no Blogger e daqui não dá para baixá-las).

## Páginas

- `index.html`: assuntos (links) e últimas postagens, vindos do Supabase pelo navegador (`blog.js`).
- `quem-sou-eu.html`, `sessoes.html`: texto fixo, copiado do Blogger. A foto de `quem-sou-eu.html` ainda é carregada do endereço do Blogger (se o Blogger sair do ar, some: trocar por arquivo do repositório). O ícone de WhatsApp dessa página já é o roxo do repositório.
- `style.css`: estilo de tudo. **Mexeu nele, bumpar o `?v=` em TODAS as páginas e em `api/_blog.js`** e pedir ao Cássio para tocar em "Atualizar as páginas do blog" (as páginas já geradas guardam o `?v=` antigo).
- `blog.js` (`?v=` também): peças comuns do blog no navegador.
- `postagem.html?p=<slug>` e `assunto.html?a=<slug>`: leitores diretos do Supabase (servem enquanto a página própria ainda não foi gerada). `404.html` redireciona `/blog/<slug>.html` e `/assunto/<slug>.html` que ainda não existem para eles.
- `admin.html`: painel do blog (noindex). Entra **só com o Google** (20/10/2026: o formulário de e-mail e senha foi removido a pedido dele; mesmo cadastro do Supabase do Falando de Astrologia, `sou_admin()`).

## Blog: como funciona

- Postagens na tabela **`psicanalise_posts`** do Supabase (o mesmo projeto do Falando de Astrologia, tabela separada de `blog_posts`): `slug`, `titulo`, `assunto`, `resumo`, `corpo`, `imagem_url`, `video_url`, `publicado`, `publicado_em`, `atualizado_em`. Imagens no bucket `site` (`psi-<timestamp>.jpg`).
- Texto da postagem: parágrafos separados por linha em branco; `## ` no começo da linha = subtítulo. Tudo entra como texto, nunca HTML. **Um assunto por postagem.**
- **RLS (lição aprendida):** o visitante comum NÃO pode chamar `sou_admin()`; uma policy `publicado = true or sou_admin()` dá erro 401 para quem não está logado e a home mostra "Não foi possível carregar os textos". Por isso são duas policies de leitura: `publico le publicadas` (`to anon, authenticated using (publicado = true)`) e `admin le tudo` (`to authenticated using (public.sou_admin())`).
- **Páginas estáticas** (para o Google) geradas por `api/blog-publicar.js` + `api/_blog.js` (Vercel, projeto `pereiracassiogithubio`, `https://pereiracassiogithubio.vercel.app`): `blog/<slug>.html`, `assunto/<slug>.html`, `sitemap.xml` e `robots.txt`, num único commit na `main` pela API do GitHub. O botão **Atualizar as páginas do blog** do painel chama esse endpoint (a constante `GERAR_URL` em `admin.html`).
  - Variável na Vercel: só `GITHUB_TOKEN` (token fine-grained, só este repositório, **Contents: Read and write**, sem expiração). Mexeu na variável = Redeploy.
  - O endpoint confere o login (`sou_admin`) e lê as postagens com o token do próprio administrador (a chave pública sozinha deu 401).
  - **Esse commit do servidor vai direto para a `main`: antes de qualquer push, `git fetch origin main` e juntar** (merge), senão o push é rejeitado ou apaga as páginas geradas.
  - Salvar uma postagem NÃO republica o site: ele toca em "Atualizar as páginas do blog" UMA vez ao terminar (cada commit na `main` republica o GitHub Pages e o GitHub limita a frequência).
- O painel mostra o motivo real do erro quando atualizar as páginas falha (ex.: "servidor respondeu 500 ...").
- Fim de cada postagem: vídeo do YouTube (se houver) e botão **"Agendar uma sessão" roxo preenchido com letra creme** (`.blog-botao.cheio`). Ele abre o WhatsApp `wa.me/5511970404508` com mensagem pronta POR POSTAGEM: "Oi, Cássio! Li o texto *título* no seu site e quero saber como funcionam as sessões." (um asterisco de cada lado = negrito do WhatsApp; no campo de digitação os asteriscos aparecem e somem depois de enviar). O link curto `wa.me/message/...` não é mais usado aqui (o texto dele é configurado dentro do WhatsApp Business); continua só em `sessoes.html`. O YouTube de psicanálise está parado; as postagens saem dos vídeos dele.
- Login com Google no painel: o endereço `https://pereiracassio.github.io/admin.html` está em Redirect URLs do Supabase (Authentication → URL Configuration). Se mudar de domínio, adicionar o novo ali.
- Google Search Console: ainda NÃO foi adicionado este site nem enviado o `sitemap.xml`.

## Como testar sem login

Servir a pasta com `python3 -m http.server`, abrir no Chromium (Playwright) interceptando `**/rest/v1/psicanalise_posts*` com JSON falso. Daqui a rede só alcança o GitHub; Vercel, Blogger e Google Fonts ficam bloqueados.

## Pegadinhas de 20/10/2026

- As páginas geradas (`blog/`, `assunto/`) ficam desatualizadas quando `api/_blog.js` ou o CSS mudam: sempre pedir ao Cássio para tocar em "Atualizar as páginas do blog" (uma vez) depois de publicar, e testar em aba anônima (o navegador guarda a versão antiga).
- `pkill -f http.server` dentro de um comando que contém essas palavras mata o próprio shell; para parar o servidor de teste, usar outro jeito.

## Foto do "Quem sou eu" e domínio próprio (20/10/2026)

- **Foto da página Quem sou eu trocável pelo painel:** botão **Trocar a foto do Quem sou eu** em `admin.html` (ao lado de "Nova postagem"). A foto é cortada em quadrado (720 px, pelo centro), vai para o bucket `site` (`psi-foto-<timestamp>.jpg`) e o endereço fica em `site_config` (chave **`psi_foto_quem_sou_eu`**, mesma tabela do Falando de Astrologia, chave separada da dele `foto_sobre`). `quem-sou-eu.html` lê essa chave e troca a imagem; a foto do Blogger é só a reserva até ele trocar pela primeira vez. A cópia em `localStorage` (`psi_foto_quem_sou_eu`) é só cache de exibição para não piscar a foto velha.
- **Domínio comprado: `pereiracassio.com.br`** (Registro.br, 20/10/2026, titular o próprio Cássio, vence em 20/10/2027). DNS no próprio Registro.br em modo avançado: quatro registros `A` (nome vazio) `185.199.108.153`, `.109.153`, `.110.153`, `.111.153` e `CNAME www → pereiracassio.github.io`. Na primeira vez a tela de DNS ficou "em transição" por algum tempo; o domínio demorou a abrir.
- **FALTA (ordem importa):** 1) esperar o DNS abrir (`pereiracassio.com.br` deve mostrar a página 404 do GitHub); 2) só então criar o arquivo `CNAME` com `pereiracassio.com.br` na raiz deste repositório (se for antes do DNS, o `pereiracassio.github.io` redireciona para um endereço que não abre e o site cai); 3) em Settings → Pages do repositório, conferir o domínio personalizado e ligar "Enforce HTTPS"; 4) trocar `https://pereiracassio.github.io` por `https://pereiracassio.com.br` em `admin.html` (Redirect URLs do login com Google no Supabase: adicionar o novo endereço), no `sitemap.xml`/`robots.txt`, no `api/_blog.js` (endereços canônicos), nos links da bio do Instagram e nestas notas; 5) Search Console do domínio novo (propriedade "prefixo do URL") e enviar `sitemap.xml`. **O endereço do GitHub (`github.io`) NÃO se verifica no Search Console** (a tela pede DNS): por isso só se faz o Search Console no domínio novo.
- Capa do WhatsApp Business: o quadro de recorte tem proporção ~5:2 (por exemplo 1500 × 600 px). Fonte do título "Fraunces" Bold e do texto "Karla".
