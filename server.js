'use strict';
// my port
const PORT=3000;


//dependencies
const express =require('express');
const cors = require('cors');
const app=express();
app.use(cors());

// run on port
app.listen(PORT, ()=> console.log(`App is running on Server on port: ${PORT}`));



app.get('/location', handleLocation);


// app.get('/restaurants', handleRestaurant);
function handleLocation(request, response){
  const getLocation = require('./Data/location.json');
  const city = request.query.city;
  let obj = {
    search_query:getLocation[0].display_name.split(',')[0],
    formatted_query: getLocation[0].display_name,
    latitude: getLocation[0].lat,
    longitude: getLocation[0].lon
  };
  response.send(obj);

}
