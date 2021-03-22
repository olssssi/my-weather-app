const api = {
  key: "5affca8a1a05163220b638ee8016d137",
  base: "https://api.openweathermap.org/data/2.5/"
}



let geocode = {
    reverseGeocode: function(latitude, longitude){
          var apikey = '9f61a5e3f3364a7eb0a3b0096115afd4';
          var api_url = 'https://api.opencagedata.com/geocode/v1/json'

          var request_url = api_url
            + '?'
            + 'key=' + apikey
            + '&q=' + encodeURIComponent(latitude + ',' + longitude)
            + '&pretty=1'
            + '&no_annotations=1';

          // see full list of required and optional parameters:
          // https://opencagedata.com/api#forward

          var request = new XMLHttpRequest();
          request.open('GET', request_url, true);

          request.onload = function() {
            // see full list of possible response codes:
            // https://opencagedata.com/api#codes

            if (request.status === 200){
              // Success!
              var data = JSON.parse(request.responseText);
              if(data.results[0].components.city)
                getResults(data.results[0].components.city);
              else if(data.results[0].components.town)
                getResults(data.results[0].components.town);
              else
                getResults("London");
            } else if (request.status <= 500){
              // We reached our target server, but it returned an error

              console.log("unable to geocode! Response code: " + request.status);
              var data = JSON.parse(request.responseText);
              console.log('error msg: ' + data.status.message);
            } else {
              console.log("server error");
            }
          };

          request.onerror = function() {
            // There was a connection error of some sort
            console.log("unable to connect to server");
          };

          request.send();
    },
    getLocation: function(){
        function success(data){
            geocode.reverseGeocode(data.coords.latitude,data.coords.longitude);
        }

        if(navigator.geolocation)
            navigator.geolocation.getCurrentPosition(success,console.error);
        else
            getResults("London");
    }
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);
geocode.getLocation();

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResults (query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
      return weather.json();
    }).then(displayResults);
}

function displayResults (weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder (d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}