'use strict';
// my port
const PORT=3000;
//dependencies
const express =require('express');
const cors = require('cors');
const app=express();
app.use(cors());

app.get('/location', handleLocation);
app.get('/weather', handleWeather);

function Location(search_query,formatted_query,latitude,longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
}

function handleLocation(request, response){
  const getLocation = require('./Data/location.json');
  let city = request.query.city;
  let obj = new Location(city, getLocation[0].display_name, getLocation[0].lat, getLocation[0].lon);
  response.send(obj);

}
function WeatherObj(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}

function handleWeather(request,response){
  let getWeather = require('./Data/weather.json');
  let weatherArr = [];
  getWeather.data.forEach((obj) => {
    weatherArr.push(new WeatherObj(obj.weather.description, obj.valid_date));
  });
  response.send(weatherArr);

}
// run on port
app.listen(PORT, ()=> console.log(`App is running on Server on port: ${PORT}`));
