function calculate() {
  //pesquisa os elementos de entrada e saída no documento
  var amount = document.getElementById("amount");
  var apr = document.getElementById("apr");
  var years = document.getElementById("years");
  var zipcode = document.getElementById("zipcode");
  var payment = document.getElementById("payment");
  var total = document.getElementById("total");
  var totalinterest = dcocument.getElementById("totalinterest");

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

