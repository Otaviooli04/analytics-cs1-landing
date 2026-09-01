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
| Telas do protótipo | Três telas em abas: questão com diagnóstico, meu progresso e painel do professor |
| Proposta de valor | *Errar e entender por quê*, no título e em seção própria |
| Depoimento | Três falas das entrevistas de Descoberta do Cliente |
| Chamada para ação | Formulário de entrada no piloto |
| Ferramenta interativa | Duas: o diagnóstico ao vivo e a calculadora de esforço |

Infográficos, que a mesma aula lista como material colateral no slide 19:

1. **Ciclo do erro** — o laço em que o aluno cai hoje, anotado com os números das entrevistas.
2. **Funil do motor** — análise estática e execução isolada alimentando as heurísticas, com a IA generativa entrando só depois do veredito.
3. **539 → 138** — o campo de submissões colapsando em códigos representativos.
4. **Comparativo** — matriz de atributos contra CodeRunner, VPL, Beecrowd, IA generativa e monitoria.

## Detalhes que valem saber antes de editar

- **Os textos de diagnóstico são os reais**, copiados de `backend/app/engine/heuristics.py` do
  repositório do produto. Se as regras mudarem lá, vale atualizar aqui.
- **A calculadora usa o fator 3,91×**, medido na validação sobre 539 submissões reais. A conta
  cobre só o tempo de leitura de código.
- **O formulário guarda no `localStorage` e não envia nada.** É proposital, para não prometer
  um aviso por e-mail que ainda não existe. Quando houver back-end, o ponto de troca é a função
  `confirmar` no fim do `<script>`.
- **Tema claro e escuro.** Segue o sistema por padrão e o botão na barra superior força um dos
  dois, guardando a escolha no navegador.
- **Números da página**: 539 submissões, 99,6% de concordância, 3,9× menos itens e 27 categorias.
  Todos vêm da validação do motor, não são projeções.

## Publicar na internet

Como é uma página estática, qualquer hospedagem serve.

- **GitHub Pages**: subir o repositório, e em *Settings → Pages* apontar para a branch `main`, pasta raiz.
- **Netlify ou Vercel**: arrastar a pasta na interface, sem configuração.

## Origem

O conteúdo sai dos documentos da disciplina de Produtos Digitais, em
`produtos-digitais-cs1/docs/produto/`: proposta do produto, visão e missão, personas e mercado,
Lean Canvas, teste das hipóteses e as entrevistas com alunos.
