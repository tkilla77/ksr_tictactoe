const tempAare = document.getElementById('tempAare');
const url = 'https://aareguru.existenz.ch/v2018/current?app=gymkirchenfeld.ch'

function fetchJson(uri, responseFunc) {
  window.fetch(uri).then(response => {
    if (response.ok) {
      response.json().then(json => {
        responseFunc(json);
      }).catch(error => {
        console.log('Cannot decode JSON: ' + errir);
      });
    } else {
      console.log('Cannot fetch ' + uri + ', status: ' + response.status);
    }
  });
}

function loadedTemp (data) {
  tempAare.textContent = data.aare.temperature + '°C';
};

function requestTemp () {
  fetchJson(url, loadedTemp);
};

requestTemp();