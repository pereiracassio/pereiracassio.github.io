# Notas para trabalhar neste repositório (site de Cássio Pereira, psicanalista)

Site e blog de psicanálise em `https://pereiracassio.github.io` (GitHub Pages). Foi feito nos moldes do blog do Falando de Astrologia
(repositório `pereiracassio/falandodeastrologia`), só que bem mais simples. Quando houver domínio próprio, basta apontá-lo para este repositório.

## Como conversar com o astrólogo/psicanalista (ele é o Cássio, mesma pessoa dos outros sites)

- **Respostas curtas e UMA pergunta por vez.** Ele se perde com listas de perguntas e explicações longas.
- **Só publicar na `main` quando ele pedir, a cada vez** (`git push origin <branch>:main`). Um "pode publicar" vale para aquela mudança só.
- Ele **não vê** avisos internos do sistema (o aviso do hook de git sobre "commit sem branch remota" é um alarme falso, porque olha os outros repositórios da sessão). Não repetir esse aviso para ele.
- SQL do Supabase e links de painéis: **sempre escritos na conversa**, para ele copiar e rodar. Ele não enxerga branches, só o que está na `main`.
- Visual: fundo branco, cabeçalho preto, roxo (`--roxo` `#4b2a7b`) como destaque. Fontes **Fraunces** (títulos) e **Karla** (texto), escolhidas por ele (03 de quatro opções). Nada de traço/sublinhado enfeitando o título (ele detestou o que veio do Blogger).
- **REGRA DE PADRÃO (19/10/2026): títulos E subtítulos de página/texto são sempre ROXO** (`var(--roxo)`): `h1.pagina`, `.texto h2`, `.texto h3`, `.blog-h2`. Toda página nova segue isso, sem exceção. Texto corrido fica preto.
- **Favicon:** o divã do logo do canal de YouTube "Divã Pop" (só o desenho, sem o texto, que não se lê em 16px), traço roxo-claro sobre fundo escuro arredondado (`favicon.png` 512, `favicon-32.png`, `favicon-48.png`, `favicon.ico`, `apple-touch-icon.png`). Todas as páginas e o `api/_blog.js` apontam para eles com `?v=1`. O logo "Divã Pop" é definitivo (o canal é de psicanálise em linguagem popular, também para o público gay). Não foi preciso SVG.
- O nome do projeto é "Cássio Pereira, Psicanalista Clínico". O cabeçalho do Blogger tinha uma foto e o desenho do divã ("Divã Pop"); ainda não foram trazidos (as imagens estão no Blogger e daqui não dá para baixá-las).

## Páginas

- `index.html`: assuntos (links) e últimas postagens, vindos do Supabase pelo navegador (`blog.js`).
- `quem-sou-eu.html`, `sessoes.html`: texto fixo, copiado do Blogger. A foto e o ícone do WhatsApp de `quem-sou-eu.html` ainda são carregados do endereço do Blogger (se o Blogger sair do ar, sumem: trocar por arquivos do repositório).
- `style.css`: estilo de tudo. **Mexeu nele, bumpar o `?v=` em TODAS as páginas e em `api/_blog.js`** e pedir ao Cássio para tocar em "Atualizar as páginas do blog" (as páginas já geradas guardam o `?v=` antigo).
- `blog.js` (`?v=` também): peças comuns do blog no navegador.
- `postagem.html?p=<slug>` e `assunto.html?a=<slug>`: leitores diretos do Supabase (servem enquanto a página própria ainda não foi gerada). `404.html` redireciona `/blog/<slug>.html` e `/assunto/<slug>.html` que ainda não existem para eles.
- `admin.html`: painel do blog (noindex). Entra com **Google** ou e-mail/senha do administrador (mesmo cadastro do Supabase do Falando de Astrologia, `sou_admin()`).

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
- Fim de cada postagem: vídeo do YouTube (se houver) e botão "Agendar uma sessão" (WhatsApp `wa.me/message/M73L2KE2I4OYB1`). O YouTube de psicanálise está parado; as postagens saem dos vídeos dele.
- Login com Google no painel: o endereço `https://pereiracassio.github.io/admin.html` está em Redirect URLs do Supabase (Authentication → URL Configuration). Se mudar de domínio, adicionar o novo ali.
- Google Search Console: ainda NÃO foi adicionado este site nem enviado o `sitemap.xml`.

## Como testar sem login

Servir a pasta com `python3 -m http.server`, abrir no Chromium (Playwright) interceptando `**/rest/v1/psicanalise_posts*` com JSON falso. Daqui a rede só alcança o GitHub; Vercel, Blogger e Google Fonts ficam bloqueados.
