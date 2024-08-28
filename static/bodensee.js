const tempBodensee = document.getElementById('tempBodensee');
const badi_romanshorn_id = 16;
const bodensee_id = 51;
const url = `https://www.wiewarm.ch/api/v1/temperature.json/${badi_romanshorn_id}`;

// Um await zu verwenden, muss die Funktion mit async markiert werden.
async function requestTemp () {
  try {
    // Await macht folgendes:
    // fetch(url) wird nebenläufig ausgeführt das Resultat 
    // wird irgendwann in Zukunft zur Verfügung stehen. Die
    // nebenläufige Berechnung wird mit einer Promise verfolgt.
    fetchPromise = fetch(url);
    console.log(`HTTP fetch started ${Date.now()}`);
    // Wird die Promise fulfilled, wird die response-Variable
    // gesetzt und der weitere Code ausgeführt.
    response = await fetchPromise;
    console.log(`HTTP fetch completed ${Date.now()}`);
    if (response.ok) {
      json = await response.json();
      console.log(`JSON parse completed ${Date.now()}`);
      tempBodensee.textContent = json[bodensee_id].temp + '°C';
      console.log(`update HTML ${Date.now()}`);
    }
  } catch (x) {
    console.log(`Cannot fetch ${url}, status: ${x}`);
  }
}

console.log(`requestTemp start ${Date.now()}`);
requestTemp();
console.log(`requestTemp end ${Date.now()}`);
