

const button = document.querySelector('.button_converter');


button.addEventListener('click', convertValue )



const selectCurrency = document.querySelectorAll('select')[1];

// Função principal de conversão usando a cotação atual da API
async function convertValue() {
    const inputCurrency = document.querySelector(".input_currency").value;
    const valueToConvertElement = document.querySelector(".currency_value_to_convert");
    const valueConvertedElement = document.querySelector(".currency_value_converted");
  
    // Normaliza o valor inserido (remove símbolos, pontos, etc. e troca vírgula por ponto)
    let numericValue = inputCurrency
      .replace(/[^\d,]/g, "")
      .replace(".", "")
      .replace(",", ".");
    numericValue = parseFloat(numericValue) || 0;
  
    // Exibe o valor digitado como Real
    valueToConvertElement.innerHTML = numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  
    // Obtém a moeda selecionada ("U$ Dólar Americano" ou "€ Euro")
    const selectedCurrencyText = selectCurrency.options[selectCurrency.selectedIndex].innerText;
  
    try {
      // Busca as cotações atuais de USD e EUR em relação ao BRL
      const response = await fetch(
        "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL"
      );
      const data = await response.json();
  
      const dolarToday = parseFloat(data.USDBRL.bid); // 1 USD em BRL
      const euroToday = parseFloat(data.EURBRL.bid);  // 1 EUR em BRL
  
      let convertedValue;
      let locale;
      let currencyCode;
  
      if (selectedCurrencyText.includes("Euro")) {
        // Converter de Real para Euro
        convertedValue = numericValue / euroToday;
        locale = "de-DE";
        currencyCode = "EUR";
      } else {
        // Converter de Real para Dólar
        convertedValue = numericValue / dolarToday;
        locale = "en-US";
        currencyCode = "USD";
      }
  
      const formattedConvertedValue = convertedValue.toLocaleString(locale, {
        style: "currency",
        currency: currencyCode,
      });
  
      // Exibe o valor convertido formatado
      valueConvertedElement.innerHTML = formattedConvertedValue;
    } catch (error) {
      console.error("Erro ao buscar cotações:", error);
      valueConvertedElement.innerHTML = "Erro na cotação";
    }
  }

  // Trocar a bandeira e o texto quando selecionar a moeda no <select>

  // Seletores para imagem e texto de moeda destino
  const flagElement = document.querySelector(".flag_us");
  const currencyLabelElement = document.querySelectorAll(".currency")[1];

  selectCurrency.addEventListener("change", function () {
    const selectedCurrencyText = selectCurrency.options[selectCurrency.selectedIndex].innerText;

    if (selectedCurrencyText.includes("Euro")) {
      flagElement.src = "./assets/euro.png"; // Certifique-se de ter essa imagem na sua pasta assets
      flagElement.alt = "Logo moeda Euro";
      currencyLabelElement.textContent = "€ Euro";
    } else {
      flagElement.src = "./assets/united-states.png";
      flagElement.alt = "Logo moeda Dólar Americano";
      currencyLabelElement.textContent = "U$ Dólar Americano";
    }
  });

  // Permitir conversão automática ao trocar o select "Converter para:"
  selectCurrency.addEventListener("change", function () {
    convertValue();
  });

  // Permitir selecionar qualquer moeda em ambos os selects e tratar as conversões nas duas direções

  // Seletores dos dois selects
  const selectFrom = document.querySelectorAll("select")[0];
  const selectTo = document.querySelectorAll("select")[1];

  // Atualizar as opções dos selects para incluir todas as moedas em ambos
  function updateSelectOptions() {
    // Lista de moedas e seus textos
    const currencies = [
      { code: "BRL", text: "R$ Real Brasileiro", flag: "./assets/brazil.png", alt: "Logo do Brasil", locale: "pt-BR", symbol: "R$" },
      { code: "USD", text: "U$ Dólar Americano", flag: "./assets/united-states.png", alt: "Logo moeda Dólar Americano", locale: "en-US", symbol: "U$" },
      { code: "EUR", text: "€ Euro", flag: "./assets/euro.png", alt: "Logo moeda Euro", locale: "de-DE", symbol: "€" }
    ];

    // Limpa e preenche os selects
    [selectFrom, selectTo].forEach(select => {
      select.innerHTML = "";
      currencies.forEach(currency => {
        const option = document.createElement("option");
        option.value = currency.code;
        option.innerText = currency.text;
        select.appendChild(option);
      });
    });

    // Seleção padrão (Converter de BRL para USD)
    selectFrom.value = "BRL";
    selectTo.value = "USD";
  }

  updateSelectOptions();

  // Elementos relevantes
  const inputValue = document.querySelector(".input_currency");
  const buttonConverter = document.querySelector(".button_converter");
  const valueToConvertElement = document.querySelector(".currency_value_to_convert");
  const valueConvertedElement = document.querySelector(".currency_value_converted");
  const flagFromElement = document.querySelector(".flag_br");
  const flagToElement = document.querySelector(".flag_us");
  const currencyLabelElements = document.querySelectorAll(".currency");

  // Função para atualizar bandeiras e labels de ambas moedas
  function updateFlagsAndLabels() {
    // Dados das moedas (igual ao de updateSelectOptions)
    const currencies = {
      BRL: { text: "Real Brasileiro", flag: "./assets/brazil.png", alt: "Logo do Brasil", locale: "pt-BR", symbol: "R$" },
      USD: { text: "U$ Dólar Americano", flag: "./assets/united-states.png", alt: "Logo moeda Dólar Americano", locale: "en-US", symbol: "U$" },
      EUR: { text: "€ Euro", flag: "./assets/euro.png", alt: "Logo moeda Euro", locale: "de-DE", symbol: "€" }
    };
    const from = selectFrom.value;
    const to = selectTo.value;

    flagFromElement.src = currencies[from].flag;
    flagFromElement.alt = currencies[from].alt;
    currencyLabelElements[0].textContent = currencies[from].text;

    flagToElement.src = currencies[to].flag;
    flagToElement.alt = currencies[to].alt;
    currencyLabelElements[1].textContent = currencies[to].text;
  }

  selectFrom.addEventListener("change", () => {
    // Impedir escolha igual nos dois selects: se igual, muda o outro
    if (selectFrom.value === selectTo.value) {
      let idx = selectTo.selectedIndex;
      selectTo.selectedIndex = (idx + 1) % selectTo.options.length;
    }
    updateFlagsAndLabels();
    convertValue();
  });
  selectTo.addEventListener("change", () => {
    // Impedir escolha igual nos dois selects: se igual, muda o outro
    if (selectFrom.value === selectTo.value) {
      let idx = selectFrom.selectedIndex;
      selectFrom.selectedIndex = (idx + 1) % selectFrom.options.length;
    }
    updateFlagsAndLabels();
    convertValue();
  });

  // Função para formatar valores conforme moeda/locale
  function formatValue(value, locale, currency) {
    return value.toLocaleString(locale, { style: "currency", currency });
  }

  // Novo convertValue mais genérico
  async function convertValue() {
    const from = selectFrom.value;
    const to = selectTo.value;
    let valueString = inputValue.value.replace(/[^\d,.-]/g, "").replace(",", ".");
    let numericValue = Number(valueString);

    if (!numericValue || numericValue <= 0) {
      // Entrada inválida, mostrar 0,00
      valueToConvertElement.innerHTML = "0,00";
      valueConvertedElement.innerHTML = "0,00";
      return;
    }

    // Exibir o valor digitado formatado
    const localeMap = { BRL: "pt-BR", USD: "en-US", EUR: "de-DE" };
    const currencyMap = { BRL: "BRL", USD: "USD", EUR: "EUR" };
    valueToConvertElement.innerHTML = formatValue(numericValue, localeMap[from], currencyMap[from]);

    // Obter cotações atuais
    try {
      const url = "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL";
      const response = await fetch(url);
      const data = await response.json();
      const usdbrl = Number(data.USDBRL.bid);
      const eurbrl = Number(data.EURBRL.bid);

      let converted = 0;

      // Conversões de BRL
      if (from === "BRL" && to === "USD") {
        converted = numericValue / usdbrl;
      } else if (from === "BRL" && to === "EUR") {
        converted = numericValue / eurbrl;
      }
      // Conversões para BRL
      else if (from === "USD" && to === "BRL") {
        converted = numericValue * usdbrl;
      } else if (from === "EUR" && to === "BRL") {
        converted = numericValue * eurbrl;
      }
      // USD <-> EUR (Conversão cruzada via BRL)
      else if (from === "USD" && to === "EUR") {
        // USD → BRL → EUR
        const valueInBRL = numericValue * usdbrl;
        converted = valueInBRL / eurbrl;
      } else if (from === "EUR" && to === "USD") {
        // EUR → BRL → USD
        const valueInBRL = numericValue * eurbrl;
        converted = valueInBRL / usdbrl;
      }

      valueConvertedElement.innerHTML = formatValue(converted, localeMap[to], currencyMap[to]);
    } catch (e) {
      valueConvertedElement.innerHTML = "Erro na cotação";
      console.error(e);
    }
  }

  // Converter ao clicar no botão
  buttonConverter.addEventListener("click", convertValue);
  // Converter ao digitar valor
  inputValue.addEventListener("input", convertValue);

  // Inicializar labels e bandeiras com selects padrão
  updateFlagsAndLabels();
  convertValue();

