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

  // Controllo semplice: se mobile, avviso
  if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
    alert("Il riepilogo PDF è disponibile da computer.");
    return;
  }

  fetch("./data/invalsi1.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (domande) {

      var jsPDF = window.jspdf.jsPDF;
      var doc = new jsPDF();

      var y = 15;
      var punteggio = 0;

      doc.setFontSize(16);
      doc.text("Riepilogo prova INVALSI", 10, y);
      y += 10;

      doc.setFontSize(10);
      doc.text("Data: " + new Date().toLocaleString(), 10, y);
      y += 10;

      for (var i = 0; i < domande.length; i++) {

        var risposta = document.querySelector(
          'input[name="q' + i + '"]:checked'
        );

        doc.setFontSize(11);
        doc.text((i + 1) + ". " + (domande[i].quesito || domande[i].testo), 10, y);
        y += 7;

        for (var j = 0; j < domande[i].opzioni.length; j++) {
          var testo = "- " + domande[i].opzioni[j];

          if (j === domande[i].corretta) {
            testo += " (corretta)";
          }

          if (risposta && j === parseInt(risposta.value, 10)) {
            testo += "  <-- risposta data";
            if (j === domande[i].corretta) {
              punteggio++;
            }
          }

          doc.setFontSize(10);
          doc.text(testo, 12, y);
          y += 6;

          if (y > 270) {
            doc.addPage();
            y = 15;
          }
        }

        y += 4;
      }

      doc.setFontSize(12);
      doc.text(
        "Punteggio finale: " + punteggio + " / " + domande.length,
        10,
        y + 5
      );

      doc.save("riepilogo_invalsi.pdf");
    });
}
