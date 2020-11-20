const mymap = L.map('checkinMap').setView([0, 0], 1);

//tekst copyright van openstreetmap
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//url
const tile_url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

//geef deze mee aan de tiles(layout)
const tiles = L.tileLayer(tile_url, {
    attribution
});
tiles.addTo(mymap);


getData();

async function getData() {

    const response = await fetch('/api');
    const data = await response.json();

    for (item of data) {
        const marker = L.marker([item.lat, item.lon]).addTo(mymap);

        if(item.air_quality.value < 0) {
            marker.bindPopup('No measurements found for this city!');
        } else {
            const txt = `Weather here at ${item.lat}°, ${item.lon}°, with a temperature of
            ${item.weather.main.temp}° Celcius. The concentration of particular matter (${item.air_quality.parameter}) is
            ${item.air_quality.value} ${item.air_quality.unit}
            last read on ${item.air_quality.lastUpdated}.`;
    
            marker.on('mouseover', (ev) => {
                marker.bindPopup(txt);
            });
        }

        
    }

}