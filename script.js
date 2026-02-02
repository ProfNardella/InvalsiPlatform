fetch("./data/invalsi1.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (domande) {

    var quizDiv = document.getElementById("quiz");

    for (var i = 0; i < domande.length; i++) {
      var domanda = domande[i];

      var p = document.createElement("p");
      
      // CONTEXTO (se esiste)
if (domanda.contesto) {
  var contesto = document.createElement("div");
  contesto.className = "contesto";
  contesto.innerText = domanda.contesto;
  contesto.style.whiteSpace = "pre-line";
  quizDiv.appendChild(contesto);
}


// QUESITO
var quesito = document.createElement("div");
quesito.className = "quesito";
quesito.innerHTML = (i + 1) + ". " + domanda.quesito;
quizDiv.appendChild(quesito);

    
      
      if (domanda.immagine) {
  var img = document.createElement("img");
  img.src = domanda.immagine;
  img.className = "immagine-domanda";
  quizDiv.appendChild(img);

}

      var opzioniDiv = document.createElement("div");
opzioniDiv.className = "opzioni";
quizDiv.appendChild(opzioniDiv);


      for (var j = 0; j < domanda.opzioni.length; j++) {
        var label = document.createElement("label");

        var input = document.createElement("input");
        input.type = "radio";
        input.name = "q" + i;
        input.value = j;

        label.appendChild(input);
        label.appendChild(document.createTextNode(" " + domanda.opzioni[j]));

        opzioniDiv.appendChild(label);
        opzioniDiv.appendChild(document.createElement("br"));

     
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

        var rispostaSelezionata = document.querySelector(
          'input[name="q' + i + '"]:checked'
        );

        var opzioni = document.querySelectorAll(
          'input[name="q' + i + '"]'
        );

        for (var j = 0; j < opzioni.length; j++) {
          var label = opzioni[j].parentElement;

          label.classList.remove("opzione-corretta", "opzione-sbagliata");

          if (j === domande[i].corretta) {
            label.classList.add("opzione-corretta");
          }

          if (rispostaSelezionata &&
              j === parseInt(rispostaSelezionata.value) &&
              j !== domande[i].corretta) {
            label.classList.add("opzione-sbagliata");
          }
        }

        if (rispostaSelezionata &&
            parseInt(rispostaSelezionata.value) === domande[i].corretta) {
          punteggio++;
        }
      }

      var risultato = document.getElementById("risultato");
      risultato.className = "risultato";
      risultato.innerText =
        "Risposte corrette: " + punteggio + " su " + domande.length;
    });
}

function scaricaPDF() {
  fetch("./data/invalsi1.json")
    .then(response => response.json())
    .then(domande => {

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      let y = 10;
      let punteggio = 0;

      doc.setFontSize(14);
      doc.text("Riepilogo prova INVALSI", 10, y);
      y += 10;

      doc.setFontSize(10);
      doc.text("Data: " + new Date().toLocaleString(), 10, y);
      y += 10;

      domande.forEach((domanda, i) => {
        const risposta = document.querySelector(
          'input[name="q' + i + '"]:checked'
        );

        doc.setFontSize(11);
        doc.text((i + 1) + ". " + (domanda.quesito || domanda.testo), 10, y);
        y += 7;

        domanda.opzioni.forEach((opzione, j) => {
          let testo = "- " + opzione;

          if (j === domanda.corretta) {
            testo += "  (corretta)";
          }

          if (risposta && j === parseInt(risposta.value)) {
            testo += "  <-- risposta data";
            if (j === domanda.corretta) punteggio++;
          }

          doc.setFontSize(10);
          doc.text(testo, 12, y);
          y += 6;
        });

        y += 4;

        if (y > 270) {
          doc.addPage();
          y = 10;
        }
      });

      doc.setFontSize(12);
      doc.text(
        "Punteggio finale: " + punteggio + " / " + domande.length,
        10,
        y + 10
      );

      doc.save("riepilogo_invalsi.pdf");
    });
}


