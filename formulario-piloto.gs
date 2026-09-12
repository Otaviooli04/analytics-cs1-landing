/**
 * Cria no Google Forms a lista de espera do piloto do Analytics CS1 e imprime, ja
 * no formato do index.html, o bloco FORMS que liga o formulario da landing page a ele.
 *
 * Como usar:
 *   1. Abrir script.google.com e criar um novo projeto.
 *   2. Colar este arquivo inteiro no editor, salvar.
 *   3. Rodar a funcao criarFormularioPiloto e autorizar o acesso.
 *   4. Copiar do log o bloco FORMS e colar no lugar do bloco vazio em index.html,
 *      na secao "lista do piloto" do <script>.
 *
 * O log traz tambem o link de edicao, onde ficam as respostas, e o link publico do
 * formulario, util como plano B se alguem quiser responder fora da pagina.
 *
 * Rodar de novo cria OUTRO formulario, com outros identificadores. E para rodar uma
 * vez so. Se precisar recuperar os identificadores de um formulario ja criado, use
 * lerIdentificadores e troque ID_DO_FORMULARIO pelo id que aparece na URL de edicao.
 */

var TITULO = 'Analytics CS1 — lista do piloto';

var DESCRICAO =
  'O Analytics CS1 é uma turma virtual para disciplinas introdutórias de programação em C: ' +
  'o aluno entende por que o código falhou e o professor vê a turma agrupada por tipo de erro. ' +
  'Deixe seu contato que avisamos quando a entrada abrir para a sua turma. ' +
  'O piloto é gratuito e o e-mail não vai para mais nada.';

var PERFIS = [
  'Aluno de CS1',
  'Professor da disciplina',
  'Monitor',
  'Coordenação de curso',
  'Estudo por conta própria'
];

function criarFormularioPiloto() {
  var form = FormApp.create(TITULO);
  form.setDescription(DESCRICAO);
  form.setCollectEmail(false);
  form.setConfirmationMessage('Pronto. Você está na lista: avisamos assim que o piloto abrir para a sua turma.');
  try {
    form.setRequireLogin(false);
  } catch (e) {
    // Conta pessoal nao expoe essa opcao, e o formulario ja fica aberto a qualquer um.
  }

  var nome = form.addTextItem().setTitle('Nome').setRequired(true);
  var email = form.addTextItem().setTitle('E-mail').setRequired(true);
  var perfil = form.addMultipleChoiceItem().setTitle('Você é').setChoiceValues(PERFIS).setRequired(false);
  var instituicao = form.addTextItem().setTitle('Instituição').setRequired(false);

  var campos = identificadores(form, nome, email, perfil, instituicao);
  relatar(form, campos);
  return campos;
}

function lerIdentificadores() {
  var form = FormApp.openById('ID_DO_FORMULARIO');
  var itens = form.getItems();
  var por = {};
  for (var i = 0; i < itens.length; i++) {
    por[itens[i].getTitle()] = itens[i];
  }
  var campos = identificadores(form, por['Nome'], por['E-mail'], por['Você é'], por['Instituição']);
  relatar(form, campos);
  return campos;
}

/**
 * O identificador "entry.NNN" de cada campo nao e exposto direto pela API. O caminho
 * confiavel e montar uma resposta com marcas reconheciveis, pedir a URL de preenchimento
 * previo e ler de volta qual entry recebeu qual marca.
 */
function identificadores(form, nome, email, perfil, instituicao) {
  var marcas = {};
  marcas['MARCA-NOME'] = 'nome';
  marcas['MARCA-EMAIL'] = 'email';
  marcas[PERFIS[0]] = 'perfil';
  marcas['MARCA-INSTITUICAO'] = 'instituicao';

  var resposta = form.createResponse()
    .withItemResponse(texto(nome).createResponse('MARCA-NOME'))
    .withItemResponse(texto(email).createResponse('MARCA-EMAIL'))
    .withItemResponse(escolha(perfil).createResponse(PERFIS[0]))
    .withItemResponse(texto(instituicao).createResponse('MARCA-INSTITUICAO'));

  var url = resposta.toPrefilledUrl();
  var campos = { acao: url.split('?')[0].replace(/viewform.*$/, 'formResponse') };

  var achados = url.match(/[?&]entry\.[0-9_.]+=[^&]*/g) || [];
  for (var i = 0; i < achados.length; i++) {
    var par = achados[i].substring(1).split('=');
    var valor = decodeURIComponent(par[1].replace(/\+/g, ' '));
    if (marcas[valor]) {
      campos[marcas[valor]] = par[0];
    }
  }
  return campos;
}

/*
 * addTextItem devolve um TextItem pronto, enquanto getItems devolve o Item generico,
 * que so vira TextItem depois do asTextItem. Estas duas funcoes aceitam os dois.
 */
function texto(item) {
  return typeof item.asTextItem === 'function' ? item.asTextItem() : item;
}

function escolha(item) {
  return typeof item.asMultipleChoiceItem === 'function' ? item.asMultipleChoiceItem() : item;
}

function relatar(form, campos) {
  var faltando = ['nome', 'email', 'perfil', 'instituicao'].filter(function (c) { return !campos[c]; });
  if (faltando.length) {
    Logger.log('ATENCAO: nao consegui ler o entry de: ' + faltando.join(', '));
  }

  Logger.log('Link de edicao (respostas ficam aqui): ' + form.getEditUrl());
  Logger.log('Link publico do formulario: ' + form.getPublishedUrl());
  Logger.log('');
  Logger.log('Cole este bloco no index.html, na secao "lista do piloto":');
  Logger.log('');
  Logger.log('  const FORMS = {');
  Logger.log("    acao: '" + campos.acao + "',");
  Logger.log("    campos: { nome: '" + campos.nome + "', email: '" + campos.email +
             "', perfil: '" + campos.perfil + "', instituicao: '" + campos.instituicao + "' }");
  Logger.log('  };');
}
