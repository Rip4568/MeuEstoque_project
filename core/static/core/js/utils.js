async function sendRequest(method, url, params) {
  /* Função adapatada para fazer request ao servidor django */
  try {
    const response = await fetch(url, {
      method: method, //'PUT', 'DELETE', 'POST', 'GET'
      headers: {
        "X-CSRFTOKEN": getCookie("csrftoken"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });    
    return response;
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


function parseErrorDjango(error) {
  const errors = error.responseJSON;
  let message = "";
  for (let key in errors) {
    message += `${key}: ${errors[key]}\n`;
  }
  return message;
}