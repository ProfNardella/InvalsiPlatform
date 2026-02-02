console.log("JS caricato");

// CARICAMENTO DOMANDE
fetch("./data/invalsi1.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (domande) {

    var quiz = document.getElementById("quiz");

    domande.forEach(function (d, i) {

      var p = document.createElement("p");
      p.innerHTML = "<b>" + (i + 1) + ". " + (d.quesito || d.testo) + "</b>";
      quiz.appendChild(p);

      d.opzioni.forEach(function (op, j) {

        var label = document.createElement("label");

        var input = document.createElement("input");
        input.type = "radio";
        input.name = "q" + i;
        input.value = j;

        label.appendChild(input);
        label.appendChild(document.createTextNode(" " + op));

        quiz.appendChild(label);
        quiz.appendChild(document.createElement("br"));
      });

    });

  })
  .catch(function (e) {
    alert("Errore caricamento domande");
    console.error(e);
  });

// FUNZIONI GLOBALI
function correggi() {
  fetch("./data/invalsi1.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (domande) {

      var punteggio = 0;

      for (var i = 0; i < domande.length; i++) {

        var rispostaSelezionata = document.querySelector(
          'input[name="q' + i + '"]:checked'
        );

        var opzioni = document.querySelectorAll(
          'input[name="q' + i + '"]'
        );

        for (var j = 0; j < opzioni.length; j++) {
          var label = opzioni[j].parentElement;

          // pulizia classi precedenti
          label.classList.remove("opzione-corretta", "opzione-sbagliata");

          // evidenzia corretta
          if (j === domande[i].corretta) {
            label.classList.add("opzione-corretta");
          }

          // evidenzia sbagliata selezionata
          if (rispostaSelezionata &&
              j === parseInt(rispostaSelezionata.value, 10) &&
              j !== domande[i].corretta) {
            label.classList.add("opzione-sbagliata");
          }
        }

        if (rispostaSelezionata &&
            parseInt(rispostaSelezionata.value, 10) === domande[i].corretta) {
          punteggio++;
        }
      }

      // mostra risultato
      var risultato = document.getElementById("risultato");
      if (!risultato) {
        risultato = document.createElement("div");
        risultato.id = "risultato";
        document.body.appendChild(risultato);
      }
      risultato.className = "risultato";
      risultato.innerText =
        "Risposte corrette: " + punteggio + " su " + domande.length;
    });
}


function scaricaPDF() {
  alert("PDF OK");
}
