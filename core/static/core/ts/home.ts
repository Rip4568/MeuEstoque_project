import { ButtonHTMLAttributes } from "vue";

function listnerAllbuttonsDelete() {
  const allButtons = window.document.querySelectorAll('.deletar-produto-btn');
  allButtons.forEach(button => {
    button.addEventListener('click', (button: Event) => {
      button.preventDefault();
      sendRequestDeleteProduct(button);
    });
  });
}

async function sendRequestDeleteProduct(button: Event) {
  const productId = (button.target as HTMLButtonElement).value;
  const buttonName = (button.target as HTMLButtonElement).name;
  const currentURL = window.location.href;

  try {
    const response = await fetch(currentURL, {
      method: 'DELETE',//'PUT', 'DELETE', 'POST', 'GET'
      headers: {
        //'csrftoken=QZXgnOYuyEtFG1CzZVebjhfDhI2yd33d;anyotherheader=anyothervalue'
        'X-CSRFTOKEN': getCookie('csrftoken'),
        'Content-Type': 'application/json',
      
      },
      body: JSON.stringify({
        buttonName: buttonName,
        productId: productId,
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('requisicao feita com sucesso, ' + data.message);
    } else {
      console.log('erro na requisicao' + response.status);
    }

  } catch (error) {
    throw new Error(`Erro na solicitação: ${error.message}`);
  }
}

function getCookie(name:string):string {
  const cookieValue = window.document.cookie
    .split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(name + '='));

  if (cookieValue) {
    return cookieValue.split('=')[1];
  }

  return 'CSRFTOKEN NOT FOUND';
}

listnerAllbuttonsDelete();