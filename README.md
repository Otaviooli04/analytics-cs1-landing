# Analytics CS1 — landing page

Landing page do **Analytics CS1**, a turma virtual para disciplinas introdutórias de
programação em C. Página única, estática e sem build: todo o CSS e o JavaScript estão
dentro do `index.html`. A única coisa que vem de fora são as fontes do Google Fonts,
então sem internet a página cai para as fontes do sistema e continua funcionando.

## Como rodar

Qualquer um dos três serve.

```bash
./run.sh              # servidor local em http://localhost:8080
./run.sh 3000         # em outra porta
```

```bash
python3 -m http.server 8080    # equivalente, sem o script
```

Ou simplesmente abrir o `index.html` no navegador com dois cliques. Tudo funciona por
`file://`, inclusive as duas ferramentas interativas.

## O que tem na página

A estrutura segue a checklist da **Aula 07, slide 22** (Validação do Cliente, fase 1).

| O que a aula pede | Onde está |
|---|---|
| Produto e benefícios | Seção *proposta de valor*, com um cartão por persona |
| Telas do protótipo | Quatro telas em abas, dentro da seção de cada lado: questão com diagnóstico e meu progresso em *para o aluno*, grupos de dificuldade e montagem da prova em *para o professor* |
| Proposta de valor | *Errar e entender por quê*, no título e em seção própria |
| Depoimento | Três falas das entrevistas de Descoberta do Cliente |
| Chamada para ação | Formulário de entrada no piloto |
| Ferramenta interativa | Duas: o diagnóstico ao vivo e a calculadora de esforço |

### As duas trilhas

A página tem **uma trilha por lado** e mostra só a que o visitante escolher, no seletor
*sou professor / sou aluno* logo abaixo do título. Cada trilha abre com uma jornada de quatro
passos e fecha com as telas do protótipo daquele lado: **aluno** (entrar com o código da turma,
resolver no navegador, receber o erro com nome, ver o que se repete) e **professor** (subir o
arquivo da prova, abrir a turma com um código, receber a turma agrupada, responder uma vez por
grupo). As seções comuns aos dois (o problema, a proposta de valor, o motor, o diagnóstico ao
vivo, o comparativo, os depoimentos e o piloto) aparecem sempre.

| Como a trilha é escolhida | |
|---|---|
| `.../?trilha=aluno` ou `.../#aluno` | link direto, para mandar o link certo para cada pessoa |
| Seletor no topo | grava a escolha no navegador e reescreve a URL para `?trilha=...` |
| Nada disso | cai em **professor**, que é quem abre a turma no piloto |

O seletor é a primeira coisa do topo, antes do título, porque o texto que vem depois já é
escrito para o lado escolhido.

Um `<script>` no `<head>` resolve a trilha **antes da primeira pintura** e põe
`data-trilha` no `<html>`, do mesmo jeito que o tema. Quem esconde o lado inativo é o CSS
(`[data-lado]`), não o JavaScript, então a página nunca pisca com o lado errado.

**Cada trilha tem o seu acento:** o professor é índigo (`#4f46e5` claro, `#a5b4fc` escuro) e o
aluno é o violeta original (`#7c3aed` / `#a78bfa`). Muda tudo o que usa `--accent`, inclusive o
gradiente do logo, que passou a ler `--marca-1` e `--marca-2`. A troca acontece em transição
porque as seis cores estão registradas com `@property`, o que as torna animáveis. Em navegador
sem suporte a `@property` a cor simplesmente troca na hora, sem quebrar nada.

Três movimentos acompanham a troca: a pastilha do seletor **desliza** entre as metades, o lado
que aparece **entra subindo** (`@keyframes entra-lado`, só quando a pessoa troca, nunca no
carregamento) e os saltos de âncora usam rolagem suave.

### Animações de rolagem

O conteúdo entra conforme a página desce, e cada bloco entra do jeito que combina com o que ele
mostra. Um `IntersectionObserver` marca o elemento com `.vis` quando ele aparece e para de
observá-lo, então nada reanima na volta.

| Bloco | O que faz |
|---|---|
| Faixa de validação | os números **sobem de zero** até 539, 99,6%, 3,9× e 27 |
| Barras das entrevistas | crescem da origem, uma depois da outra |
| Diagramas | se **montam na ordem em que são lidos**: caixas, rótulos, setas |
| Campo de 539 pontos | os 138 representativos **acendem em onda** sobre o campo apagado |
| Comparativo | entra **linha a linha**, como quem confere item por item |
| Calculadora | as barras **partem do zero** quando a seção aparece |
| Semanas do progresso | as barrinhas sobem toda vez que a aba é aberta |
| Cartões, telas e passos | entram subindo, escalonados dentro de cada grade |

### Duas camadas, e por que elas são separadas

**Surgir não é movimento.** O conteúdo aparecendo em opacidade não incomoda ninguém, então essa
camada vale **sempre**. Já deslocar, crescer, contar e acender em onda é movimento de verdade, e
essa camada inteira mora dentro de `@media (prefers-reduced-motion: no-preference)`. Quem pediu
menos movimento no sistema continua vendo o conteúdo surgir escalonado, só que parado no lugar,
com os números já no valor final.

Foi uma correção: antes a preferência do sistema desligava **tudo**, e numa máquina com as
animações do Windows desligadas a página parecia estática.

**Três garantias de que nada fica preso invisível:**

1. Todas as regras dependem de `data-anima="on"`, que o script do `<head>` só põe se existir
   `IntersectionObserver` para revelar de volta.
2. O bloco de JavaScript está dentro de um `try`, e qualquer erro remove o atributo.
3. Se em 3 segundos nenhum elemento tiver sido revelado, o atributo sai sozinho e a página
   inteira volta a aparecer.

**`?anima=1`** no fim do endereço força a camada de movimento, para demonstrar a página completa
numa máquina com as animações do sistema desligadas.

Se você adicionar um bloco novo que precise aparecer sempre, é só não deixá-lo virar filho direto
de `.wrap` dentro de uma `.band`, que é como os alvos são escolhidos.

> **Aviso para quem for testar com Chrome headless:** ele responde
> `prefers-reduced-motion: reduce` **sempre**, mesmo com `--headless=new`. Captura de tela em
> headless nunca mostra as animações e não serve para validá-las. Use `?anima=1` para forçar.

**Cuidado ao editar:** a faixa clara alternada (`band--tint`) não pode ser fixa no HTML, porque
as seções de trilha entram e saem do fluxo. Ela é declarada em duas listas de seletores no CSS,
uma por trilha. **Se você mudar a ordem das seções ou criar uma nova, refaça as duas listas**,
senão duas faixas do mesmo tom ficam coladas.

Infográficos, que a mesma aula lista como material colateral no slide 19:

1. **Ciclo do erro** — o laço em que o aluno cai hoje, anotado com os números das entrevistas.
2. **Uma correção, dois lados** — o ciclo do aluno e o do professor saindo da mesma correção.
3. **Funil do motor** — análise estática e execução isolada alimentando as heurísticas, com a IA generativa entrando só depois do veredito.
4. **539 → 138** — o campo de submissões colapsando em códigos representativos.
5. **Comparativo** — matriz de atributos contra CodeRunner, VPL, Beecrowd, IA generativa e monitoria.

## Detalhes que valem saber antes de editar

- **Os textos de diagnóstico são os reais**, copiados de `backend/app/engine/heuristics.py` do
  repositório do produto. Se as regras mudarem lá, vale atualizar aqui.
- **A calculadora usa o fator 3,91×**, medido na validação sobre 539 submissões reais. A conta
  cobre só o tempo de leitura de código.
- **O formulário envia para um Google Forms** e só guarda uma cópia local para lembrar quem já
  se inscreveu. Os identificadores ficam no bloco `FORMS`, no começo da seção *lista do piloto*
  do `<script>`. Enquanto o bloco estiver vazio, o envio recusa e manda escrever por e-mail,
  em vez de dizer que inscreveu alguém. Como o Google não devolve cabeçalho de CORS, a resposta
  é opaca: dá para saber que a requisição saiu, não o que o Google respondeu.
- **Tema claro e escuro.** Segue o sistema por padrão e o botão na barra superior força um dos
  dois, guardando a escolha no navegador.
- **O formulário já vem com o perfil da trilha** marcado no campo *Você é*, até a pessoa
  escolher outro. Depois disso a troca de trilha não mexe mais no campo.
- **Números da página**: 539 submissões, 99,6% de concordância, 3,9× menos itens e 27 categorias.
  Todos vêm da validação do motor, não são projeções.

## Ligar a lista do piloto

O formulário da página só funciona depois que existe um Google Forms para receber as respostas.
O `formulario-piloto.gs` cria esse formulário e já imprime o bloco pronto para colar.

1. Abrir [script.google.com](https://script.google.com), criar um projeto e colar o
   `formulario-piloto.gs` inteiro.
2. Rodar `criarFormularioPiloto` e autorizar o acesso.
3. Copiar do log o bloco `FORMS` e colar no `index.html`, no lugar do bloco vazio.
4. Testar uma inscrição e conferir se ela apareceu nas respostas, pelo link de edição que o log mostra.

O script é para rodar uma vez só: rodar de novo cria outro formulário, com outros identificadores.
Para recuperar os identificadores de um formulário já existente, use a função `lerIdentificadores`.

## Publicar na internet

Como é uma página estática, qualquer hospedagem serve. A escolhida é o **GitHub Pages**, porque o
repositório já está lá, não há build e basta apontar para a branch.

1. Deixar o repositório **público** (Pages em repositório privado exige GitHub Pro).
2. *Settings → Pages → Source: Deploy from a branch → `main` → `/ (root)` → Save*.
3. Em alguns minutos a página sai em `https://otaviooli04.github.io/analytics-cs1-landing/`.

Os links por trilha continuam valendo no ar: `…/analytics-cs1-landing/?trilha=aluno` e
`?trilha=professor`. Não há caminho absoluto no HTML, então servir de uma subpasta não quebra nada.

**Vercel foi descartada de propósito**: o plano Hobby proíbe uso comercial nos termos, e a página
anuncia planos pagos. Se um dia precisar de domínio próprio e métricas, a alternativa sem essa
cláusula é o Cloudflare Pages.

## Origem

O conteúdo sai dos documentos da disciplina de Produtos Digitais, em
`produtos-digitais-cs1/docs/produto/`: proposta do produto, visão e missão, personas e mercado,
Lean Canvas, teste das hipóteses e as entrevistas com alunos.
