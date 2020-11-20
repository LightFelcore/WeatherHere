let lat;
let lon;
if ('geolocation' in navigator) {


    navigator.geolocation.getCurrentPosition(async position => {
        let lat, lon, weather, air_quality;
        try {
            lat = position.coords.latitude;
            lon = position.coords.longitude;

            //geef de latitude en longitude door aan de server.
            const response = await fetch(`weather/${lat},${lon}`);
            const json = await response.json();
            console.log(json);

            weather = json.weather;
            air_quality = json.air_quality.results[0].measurements[0];

            document.getElementById('summary').textContent = weather.weather[0].description;
            document.getElementById('temperature').textContent = weather.main.temp;
            document.getElementById('aq_parameter').textContent = air_quality.parameter;
            document.getElementById('aq_value').textContent = air_quality.value;
            document.getElementById('aq_units').textContent = air_quality.unit;
            document.getElementById('aq_date').textContent = air_quality.lastUpdated;

        } catch (error) {
            console.error(error);
            //no value for airquality for this city
            air_quality = {
                value: -1
            };
        }

        const data = {
            lat,
            lon,
            weather,
            air_quality
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        const db_response = await fetch('/api', options);
        const db_json = await db_response.json();
        console.log(db_json);
    });



}