document.getElementById('weather-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const city = document.getElementById('city-input').value;
    const bubble = document.getElementById('speech-bubble');
    bubble.textContent = '🌡️ Lade Wetterdaten...';

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
        .then(res => res.json())
        .then(geo => {
            if (!geo.results || geo.results.length === 0) {
                bubble.textContent = '❌ Ort nicht gefunden!';
                return;
            }

            const lat = geo.results[0].latitude;
            const lon = geo.results[0].longitude;

            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
                .then(res => res.json())
                .then(data => {
                    const temp = data.current_weather.temperature;
                    const code = data.current_weather.weathercode;
                    let condition = '';

                    if ([0, 1].includes(code)) condition = 'Sonnig ☀️';
                    else if ([2, 3].includes(code)) condition = 'Bewölkt ⛅';
                    else if ([45, 48, 51, 53, 55, 61, 63, 65].includes(code)) condition = 'Regnerisch 🌧️';
                    else if ([95, 96, 99].includes(code)) condition = 'Gewitter ⛈️';
                    else condition = 'Unklar 🌫️';

                    bubble.textContent = `${temp}°C – ${condition}`;
                });
        })
        .catch(() => {
            bubble.textContent = '⚠️ Fehler beim Laden der Wetterdaten.';
        });
});
