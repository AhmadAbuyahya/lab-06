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

app.use('*', notFoundHandler); // 404 not found url

app.use(errorHandler);

function notFoundHandler(request, response) {
  response.status(404).send('requested API is Not Found!');
}
function errorHandler(err, request, response, next) {
  response.status(500).send('something is wrong in server');
}
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}
function locationHandler(request, response) {
  let city = request.query.city;
  let key = process.env.GEOCODE_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;
  superagent.get(url).then(res=> {
    const locationData = res.body[0];
    const location = new Location(city, locationData);
    response.send(location);
  }).catch((err)=> {
    console.log('ERROR IN LOCATION API');
    console.log(err);
  });
}



function Weather(item) {
  this.forecast = item.weather.description;
  this.time = item.valid_date;
}
let weatherArr = [];

function handleWeather(request,response){
  let key = process.env.WEATHER_API_KEY;
  let city = request.query.search_query;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  superagent.get(url).then(res=>{
    res.body.data.map(item=>{
      weatherArr.push(new Weather(item));
    });
    response.send(weatherArr);
  }).catch((err)=> {
    console.log('ERROR IN LOCATION API');
    console.log(err);
  });
}
function Park(name,address,fee,desc,url){
  this.name=name;
  this.address=address;
  this.fee=fee;
  this.desc=desc;
  this.url=url;

}
let parkArr=[];
function handleParks(request,response){
  let key=process.env.PARKS_API_KEY;
  let city = request.query.search_query;
  const url = `https://developer.nps.gov/api/v1/parks?q=${city}&api_key=${key}&limit=5`;
  superagent.get(url).then(res=>{
    res.body.data.map(element=>{
      let park =new Park(element.fullName,element.addresses[0].city,element.entranceFees[0].cost,
        element.description,element.url);
      parkArr.push(park);
    });
    response.send(parkArr);
  });
}




// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
