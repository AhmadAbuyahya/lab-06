'use strict';
// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

// Route Definitions
app.get('/location', locationHandler);
app.get('/weather', handleWeather);
app.get('/parks', handleParks);
// app.get('/restaurants', restaurantHandler);
// app.get('/places', placesHandler);

// Express has an internal error handler.
// so this means if you did not create your own.
// express handler will respond
app.use('*', notFoundHandler); // 404 not found url

app.use(errorHandler);

function notFoundHandler(request, response) {
  response.status(404).send('requested API is Not Found!');
}
function errorHandler(err, request, response, next) {
  response.status(500).send('something is wrong in server');
}
const myLocalLocations = {};

function locationHandler(request, response) {
  let city = request.query.city;
  if (myLocalLocations[city]) {
    console.log('2.from my local data');
    response.send(myLocalLocations[city]);
  } else {
    let key = process.env.GEOCODE_API_KEY;
    const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;
    superagent.get(url).then(res=> {
      const locationData = res.body[0];
      const location = new Location(city, locationData);
      myLocalLocations[city] = location;
      response.send(location);
    }).catch((err)=> {
      console.log('ERROR IN LOCATION API');
      console.log(err);
    });
  }
}

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}
function WeatherObj(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}

function handleWeather(request,response){
  let key = process.env.WEATHER_API_KEY;
  let lat = myLocalLocations.lat;
  let lon = myLocalLocations.lon;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily??lat=${lat}&lon=${lon}&key=${key}`;
  let weatherArr=[];
  superagent.get(url).then(res=>{
    res.body.data.forEach((obj)=>{
      weatherArr.push(new WeatherObj(obj.weather.description, obj.valid_date));
    });
    response.send(weatherArr);

  }).catch((err)=> {
    console.log('ERROR IN LOCATION API');
    console.log(err);
  });
}

function handleParks(request,response){
  let key=process.env.PARKS_API_KEY;
  let city = request.query.search_query;
  const url = `https://developer.nps.gov/api/v1/parks?parkCode=${query}&api_key=${key}`;
  superagent.get(url).then(res=>{

  })

}

// function restaurantHandler(request, response) {
//   // const url = 'https://developers.zomato.com/api/v2.1/geocode';
// }

// function Restaurant(entry) {
//   this.restaurant = entry.restaurant.name;
//   this.cuisines = entry.restaurant.cuisines;
//   this.locality = entry.restaurant.location.locality;
// }

// function placesHandler(request, response) {

//   // const lat = request.query.latitude;
//   // const lng = request.query.longitude;
//   // const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`;

// }

// function Place(data) {
//   this.name = data.text;
//   this.type = data.properties.category;
//   this.address = data.place_name;
// }


// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
