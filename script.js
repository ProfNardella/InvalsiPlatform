fetch("./data/invalsi1.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (domande) {
    var quizDiv = document.getElementById("quiz");

    domande.forEach(function (domanda, index) {
      var html = "<p><strong>" + (index + 1) + ". " + domanda.testo + "</strong></p>";

      domanda.opzioni.forEach(function (opzione, i) {
        html +=
          '<label>' +
          '<input type="radio" name="q' + index + '" value="' + i + '">' +
          opzione +
          "</label><br>";
      });

      quizDiv.innerHTML += html;
    });
  });

function correggi() {
  fetch("./data/invalsi1.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (domande) {
      var punteggio = 0;

      domande.forEach(function (domanda, index) {
        var risposta = document.querySelector(
          'input[name="q' + index + '"]:checked'
        );

        if (risposta && parseInt(risposta.value) === domanda.corretta) {
          punteggio++;
        }
      });

      document.getElementById("risultato").innerText =
        "Risultato: " + punteggio + " / " + domande.length;
    });
}
