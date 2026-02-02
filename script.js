fetch("./data/invalsi1.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (domande) {

    var quizDiv = document.getElementById("quiz");

    for (var i = 0; i < domande.length; i++) {
      var domanda = domande[i];

      var p = document.createElement("p");
      p.innerHTML = "<strong>" + (i + 1) + ". " + domanda.testo + "</strong>";
      quizDiv.appendChild(p);

      for (var j = 0; j < domanda.opzioni.length; j++) {
        var label = document.createElement("label");

        var input = document.createElement("input");
        input.type = "radio";
        input.name = "q" + i;
        input.value = j;

        label.appendChild(input);
        label.appendChild(document.createTextNode(" " + domanda.opzioni[j]));

        quizDiv.appendChild(label);
        quizDiv.appendChild(document.createElement("br"));
      }
    }
  });

function correggi() {

  fetch("./data/invalsi1.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (domande) {

      var punteggio = 0;

      for (var i = 0; i < domande.length; i++) {
        var risposta = document.querySelector(
          'input[name="q' + i + '"]:checked'
        );

        if (risposta && parseInt(risposta.value, 10) === domande[i].corretta) {
          punteggio++;
        }
      }

      document.getElementById("risultato").innerText =
        "Risultato: " + punteggio + " / " + domande.length;
    });
}
