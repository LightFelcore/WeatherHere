const express = require('express');
const app = express();
const fetch = require('node-fetch');
const Datastore = require('nedb');
require('dotenv').config();


//fetch is enkel mogelijk via client side. Node maakt fetch() mogelijk door bovenstaande module te importeren

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
app.use(express.static('public'));
app.use(express.json({
    limit: "1mb"
}));



const database = new Datastore('database.db');
database.loadDatabase();

app.post('/api', (request, response) => {
    const data = request.body;
    const time = new Date();
    data.time = time.toLocaleString();
    database.insert(data);
    response.json(data);

});

//Server krijg de de lat en long binnen gescheiden door een komma
app.get('/weather/:latlon', async (request, response) => {
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0]; //lat uit client
    const lon = latlon[1]; //lon uit client
    //console.log(lat, lon);

    const weather_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${process.env.API_KEY}&units=metric`;
    const weather_response = await fetch(weather_url);
    const weather_json = await weather_response.json();

    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const aq_response = await fetch(aq_url);
    const aq_json = await aq_response.json();

    const data = {
        weather: weather_json,
        air_quality: aq_json
    }
    response.json(data); //stuur data terug naar client
});

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }

        response.json(data);
    });
});