function calculate() {
  //pesquisa os elementos de entrada e saída no documento
  var amount = document.getElementById("amount");
  var apr = document.getElementById("apr");
  var years = document.getElementById("years");
  var zipcode = document.getElementById("zipcode");
  var payment = document.getElementById("payment");
  var total = document.getElementById("total");
  var totalinterest = document.getElementById("totalinterest");

  //Obtém a entrada do usuário atrtavés dos elementos de entrada. Presume que tudo isso é valído
  var principal = parseFloat(amount.value);
  //Converte os juros de porcentagem para decimais e converte a taxa anual para mensal.
  var interest = parseFloat(apr.value) / 100 / 12;
  //Converte o período de pagamento em anospara o numero de pagamentos mensais
  var payments = parseFloat(years.value) * 12;

  //Agora o calculo do pagamento mensal.
  var x = Math.pow(1 + interest, payments); //Math.pow calcula potências
  var monthly = (principal * x * interest) / (x - 1);

  //Se o resultado é um número finito, a entrada do usuário estava correta e temos resultados significativos para exibir
  if (isFinite(monthly)) {
    //Preenche os campos de saída, arredondando para 2 casas decimais
    payment.innerHTML = monthly.toFixed(2);
    total.innerHTML = (monthly * payments).toFixed(2);
    totalinterest.innerHTML = (monthly * payments - principal).toFixed(2);

    //Salva a entrada do usuário para que possamos recupera-lá na próxima vez que ele visitar
    save(amount.value, apr.value, years.value, zipcode.value);

    //Anuncio: localiza e exibe financeiras locais, mas ignora erros de rede
    try {
      //Captura quaisquer erros que ocorram dentro destas chaves
      getLenders(amount.value, apr.value, years.value, zipcode.value);
    } catch (error) {
      // e ignora esses erros
    }
    //Por fim, traça p gráfico do saldo devedor, dos juros e dos pagamentos do capital
    chart(principal, interest, monthly, payments);
  } else {
    //O resultado foi Not-a-Number ou infinito, o que significa que a entrada estava imcompleta ou era inválida.
    //Apaga qualquer saída exibida anteriormente
    payment.innerHTML = ""; //Apaga o conteúdo desses elementos
    total.innerHTML = "";
    totalinterest.innerHTML = "";
    chart(); //Sem argumentos, apaga o gráfico
  }
}

//Salva a entrada do usuário como propriedades do objeto localStorage. Essas propriedades ainda existirão quando o usuário visitar no futuro
//Esse recurso de armazenamento não vai funcionar em alguns navegadores, se executar o exemplo a partir de um arquivo local://URL. Contud, funciona com HTTP
function save(amount, apr, years, zipcode) {
  if (window.localStorage) {
    //Só faz isso se o navegador suportar
    localStorage.loan_amount = amount;
    localStorage.loan_apr = apr;
    localStorage.loan_years = years;
    localStorage.loan_zipcode = zipcode;
  }
}

//Tenta restaurar os campos de entrada  automaticamente quando o documento é carregado pela primeira vez.
window.onload = function () {
  //Se o navegador suporta localStorage e temos alguns dados armazenados
  if (window.localStorage && localStorage.loan_amount) {
    document.getElementById("amount").value = localStorage.loan_amount;
    document.getElementById("apr").value = localStorage.loan_apr;
    document.getElementById("years").value = localStorage.loan_years;
    document.getElementById("zipcode").value = localStorage.loan_zipcode;
  }
};

//Passa a entrada do usuário para um script no lado do servidor que (teoricamente) pode retornar uma lista de links para financeiras locais interessadas em fazer empréstimos.
//Este exemplo não contém uma implemenmtação real desse serviço de busca de financeiras.
//Mas se o serviço existisse, essa função funcionária com ele.
function getLenders(amount, apr, years, zipcode) {
  //Se o navegador não suporta o objeto XMLHttpRequest, n"ao faz nada
  if (!window.XMLHttpRequest) return;

  //Localiza o elemento para exibir a lista de financeiras
  var ad = document.getElementById("lenders");
  if (!ad) return; //Encerra se não há ponto de saída
  //Codifica a entrada do usuário como parâmetros de consulta em um URL
  var url =
    "getLenders.php" + //URL do serviço mais
    "?amt=" +
    encodeURIComponent(amount) + //dados do usuário na string de consulta
    "&apr=" +
    encodeURIComponent(apr) +
    "&yrs=" +
    encodeURIComponent(years) +
    "zip=" +
    encodeURIComponent(zipcode);

  //Busca o conteúdo desse URL usando o objeto XMLHttpRequest
  var rep = new XMLHttpRequest(); // Inicia um novo pedido
  req.open("Get", url); //Um pedido GET da HTTP para o url
  req.send(null); //Envia o pedido sem corpo

  //Antes de retornar, registra uma função de rotina de tratamento de evento que será chamada em um momento posterior, quando a resposta do servidor de HTTP chegar.
  //Esse tipo de programação assíncrona é muito comum em JavaScript do lado do cliente.
  req.onreadystatechange = function () {
    if (re.readyState == 4 && req.status == 200) {
      //Se chegamos até aqui, obtivemos uma resposta HTTP válida e completa
      var response = req.responseText; //Resposta HTTP como string
      var lenders = JSON.parse(response); //Analisa em um array JS

      //Converte o array de objetos lender em uma string HTML
      var list = "";
      for (var i = 0; i < lenders.length; i++) {
        list += "<li> <a href='" + lenders[i].url + "'>" + lenders[i].name + "</a>";
      }

      //Exibe o código HTML no elemento acima.
      ad.innerHTML = "<ul>" + list + "</ul>";
    }
  };
}
