function listnerAllbuttonsDelete() {
  const allButtons = window.document.querySelectorAll(".deletar-produto-btn");
  allButtons.forEach((button) => {
    button.addEventListener("click", (button) => {
      button.preventDefault();
      sendRequestDeleteProduct(button);
    });
  });
}

function listnerFormNewProduct() {
  const form = window.document.querySelector("#form-new-product");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const preco = form.querySelector("input#preco").value;
    const nome = form.querySelector("input#nome").value;
    sendRequestCreateProduct(nome, preco);
  });
}

async function sendRequestGetProducts() {
  const currentURL = new URL(window.location.href);
  currentURL.searchParams.append('produtos-ajax', '')
  try {
    const response = await fetch(currentURL.href, {
      method: "GET", //'PUT', 'DELETE', 'POST', 'GET'
      headers: {
        'X-CSRFTOKEN': getCookie('csrftoken'),
        'Content-Type': 'application/json'
      },
    });
    if(response.ok) {
      if(response.status == 200) {
        const data = await response.json();
        const produtos = window.document.querySelector("#produtos");
        produtos.innerHTML = data.html_produtos;
        listnerAllbuttonsDelete();
      }
    }
  } catch(error) {
    throw new Error(`Erro na solicitação: ${error.message}`);
  }
}

async function sendRequestCreateProduct(nome, preco) {
  //const precoFormatado = preco.replace(",", ".");
  const currentURL = new URL(window.location.href);

  try {
    const response = await fetch(currentURL.href, {
      method: "POST", //'PUT', 'DELETE', 'POST', 'GET'
      headers: {
        'X-CSRFTOKEN': getCookie('csrftoken'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'criar-novo-produto-ajax': true,
        nome: nome,
        preco: preco,
      }),
    });
    const data = await response.json();
    if(response.ok) {
      if(response.status == 200) {
        sendRequestGetProducts();
      } else {
        console.log('erro no preenchimento de campos: ' + response.message);
      }
    } else {
      console.log('erro na requisicao: ' + response.status + data.message);
    } 
  } catch(error) {
    throw new Error(`Erro na solicitação: ${error}`);
  }
}

async function sendRequestDeleteProduct(button) {
  const productId = button.target.value;
  const buttonName = button.target.name;
  const currentURL = window.location.href;

  try {
    const response = await fetch(currentURL, {
      method: "DELETE", //'PUT', 'DELETE', 'POST', 'GET'
      headers: {
        //'csrftoken=QZXgnOYuyEtFG1CzZVebjhfDhI2yd33d;anyotherheader=anyothervalue'
        "X-CSRFTOKEN": getCookie("csrftoken"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buttonName: buttonName,
        productId: productId,
      }),
    });

    if (response.ok) {
      //const data = await response.json();
      if (response.status == 200) {
        const product = window.document.querySelector(`#product-${productId}`);
        product.remove();
      }
    } else {
      console.log("erro na requisicao: " + response.status);
    }
  } catch (error) {
    throw new Error(`Erro na solicitação: ${error.message}`);
  }
}

function getCookie(name) {
  const cookieValue = window.document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(name + "="));

  if (cookieValue) {
    return cookieValue.split("=")[1];
  }

  return 'NA';
}

listnerAllbuttonsDelete();
listnerFormNewProduct();