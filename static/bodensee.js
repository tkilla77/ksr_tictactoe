const tempBodensee = document.getElementById('tempBodensee');
const badi_romanshorn_id = 16;
const bodensee_id = 51;
const url = 'https://www.wiewarm.ch/api/v1/temperature.json/' + badi_romanshorn_id;

// Um await zu verwenden, muss die Funktion mit async markiert werden.
async function requestTemp () {
    // fetch(url) wird nebenläufig ausgeführt, das Resultat 
    // wird irgendwann in Zukunft zur Verfügung stehen. Die
    // nebenläufige Berechnung wird mit einer Promise verfolgt.
    let fetchPromise = fetch(url);
    console.log(`HTTP fetch started ${Date.now()}`);
    // 'await' bewirkt, dass die Ausführung stoppt,
    // bis die Promise fulfilled ist. Dann wird die response-Variable
    // gesetzt und der weitere Code ausgeführt.
    let response = await fetchPromise;
    console.log(`HTTP fetch completed ${Date.now()}`);
    if (response.ok) {
      let json = await response.json();
      console.log(`JSON parse completed ${Date.now()}`);
      tempBodensee.textContent = json[bodensee_id].temp + '°C';
      console.log(`update HTML ${Date.now()}`);
    }
}

console.log(`requestTemp start ${Date.now()}`);
requestTemp();
console.log(`requestTemp end ${Date.now()}`);
