import tabJoursEnOrdre from "./Utilitaire/gestionTemps.js";

const keyApi = "bc444b036d5dcb7350887611f08d5c7b";

const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");

const heure = document.querySelectorAll(".nomHeure");
const tempHeure = document.querySelectorAll(".valeurHeure");

const jour = document.querySelectorAll(".nomSemaine");
const tempJour = document.querySelectorAll(".valeurSemaine");

const imgLogo = document.querySelector(".logoMeteo");
const chargement = document.querySelector(".overlayChargement");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      let longitude = position.coords.longitude;
      let latitude = position.coords.latitude;
      callApi(longitude, latitude);
    },
    function () {
      alert(
        "Vous avez refusé la géolication, l'application ne peux pas fonctionner."
      );
    }
  );
}

function callApi(longitude, latitude) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&lang=fr&appid=${keyApi}`
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);

      temps.innerText = data.current.weather[0].description;
      temperature.innerText = `${Math.trunc(data.current.temp)}°`;
      localisation.innerText = data.timezone;

      let heureActuelle = new Date().getHours();

      for (let i = 0; i < heure.length; i++) {
        let heureIncr = heureActuelle + i * 3;
        if (heureIncr > 24) {
          heure[i].innerText = `${heureIncr - 24}h`;
        } else if (heureIncr === 24) {
          heure[i].innerText = "00h";
        } else {
          heure[i].innerText = `${heureIncr}h`;
        }
      }
      for (let j = 0; j < tempHeure.length; j++) {
        tempHeure[j].innerText = `${Math.trunc(data.hourly[j * 3].temp)}°`;
      }
      for (let k = 0; k < tabJoursEnOrdre.length; k++) {
        jour[k].innerText = tabJoursEnOrdre[k].slice(0, 3);
      }
      for (let l = 0; l < 7; l++) {
        tempJour[l].innerText = `${Math.trunc(data.daily[l + 1].temp.day)}°`;
      }
      if (heureActuelle >= 6 && heureActuelle < 21){
        imgLogo.src = `ressources/jour/${data.current.weather[0].icon}.svg`
      } else {
        imgLogo.src = `ressources/nuit/${data.current.weather[0].icon}.svg`
      }
      chargement.classList.add('disparition');
    })
    .catch(function (error) {
      alert("Les données peuvent mettre un peu de temps à se charger selon le statut du serveur.");
    });
}

