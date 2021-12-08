const tempBodensee = document.getElementById('tempBodensee');
const url = 'https://www.wiewarm.ch:443/api/v1/temperature.json/49'

async function requestTemp () {
  try {
    // Await macht folgendes:
    // fetch(url) wird nebenläufig ausgeführt das Resultat 
    // wird irgendwann in Zukunft zur Verfügung stehen. Die
    // nebenläufige Berechnung wird mit einer Promise verfolgt.
    // Wird die Promise fulfilled, wird die response-Variable
    // gesetzt und der weitere Code ausgeführt.
    response = await fetch(url);
    if (response.ok) {
      json = await response.json();
      const key = 134;
      tempBodensee.textContent = json[key].temp + '°C';
    }
  } catch (x) {
    console.log('Cannot fetch ' + url + ', status: ' + x);
  }
};

requestTemp();