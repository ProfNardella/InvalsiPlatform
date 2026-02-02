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
  alert("Correzione OK");
}

function scaricaPDF() {
  alert("PDF OK");
}
