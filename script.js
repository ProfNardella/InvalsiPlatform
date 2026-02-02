
fetch("data/invalsi1.json")
  .then(response => response.json())
  .then(domande => {
    const quizDiv = document.getElementById("quiz");

    domande.forEach((domanda, index) => {
      let html = `<p><strong>${index + 1}. ${domanda.testo}</strong></p>`;

      domanda.opzioni.forEach((opzione, i) => {
        html += `
          <label>
            <input type="radio" name="q${index}" value="${i}">
            ${opzione}
          </label><br>
        `;
      });

      quizDiv.innerHTML += html;
    });
  });

function correggi() {
  fetch("data/invalsi1.json")
    .then(response => response.json())
    .then(domande => {
      let punteggio = 0;

      domande.forEach((domanda, index) => {
        const risposta = document.querySelector(
          \`input[name="q${index}"]:checked\`
        );

        if (risposta && parseInt(risposta.value) === domanda.corretta) {
          punteggio++;
        }
      });

      document.getElementById("risultato").innerText =
        \`Risultato: ${punteggio} / ${domande.length}\`;
    });
}
