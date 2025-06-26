
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
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode&timezone=auto`)
                .then(res => res.json())
                .then(data => {
                    const now = new Date();
                    const currentTemp = data.current_weather.temperature;
                    const currentCode = data.current_weather.weathercode;

                    const times = data.hourly.time;
                    const temps = data.hourly.temperature_2m;
                    const codes = data.hourly.weathercode;

                    const getForecast = (offsetHours) => {
                        const targetHour = new Date(now.getTime() + offsetHours * 60 * 60 * 1000);
                        const targetISO = targetHour.toISOString().slice(0, 13);

                        const index = times.findIndex(t => t.startsWith(targetISO));
                        if (index === -1) return null;

                        return {
                            temp: temps[index],
                            code: codes[index]
                        };
                    };

                    const formatCondition = (code) => {
                        if ([0, 1].includes(code)) return 'Sonnig ☀️';
                        if ([2, 3].includes(code)) return 'Bewölkt ⛅';
                        if ([45, 48, 51, 53, 55, 61, 63, 65].includes(code)) return 'Regnerisch 🌧️';
                        if ([95, 96, 99].includes(code)) return 'Gewitter ⛈️';
                        return 'Unklar 🌫️';
                    };

                    const f1 = getForecast(1);
                    const f3 = getForecast(3);
                    const f5 = getForecast(5);

                    let message = `Jetzt: ${currentTemp}°C – ${formatCondition(currentCode)}`;
                    if (f1 && f3 && f5) {
                        message += `<br>In 1h: ${f1.temp}°C – ${formatCondition(f1.code)}`;
                        message += `<br>In 3h: ${f3.temp}°C – ${formatCondition(f3.code)}`;
                        message += `<br>In 5h: ${f5.temp}°C – ${formatCondition(f5.code)}`;
                    }

                    bubble.innerHTML = message;
                    bubble.style.fontSize = window.innerWidth < 600 ? '13px' : '24px';
                    bubble.style.fontWeight = 'bold';
                    bubble.style.textAlign = 'center';
                    bubble.style.justifyContent = 'center';
                })
                .catch(() => {
                    bubble.textContent = '⚠️ Fehler beim Laden der Wetterdaten.';
                });
        })
        .catch(() => {
            bubble.textContent = '⚠️ Fehler beim Laden der Ortsdaten.';
        });
});
// Impressum anzeigen
document.getElementById('impressum-button').addEventListener('click', () => {
    const bubble = document.getElementById('speech-bubble');
    bubble.style.fontSize = '12px';
    bubble.style.fontWeight = 'normal';
    bubble.style.textAlign = 'left';
    bubble.style.justifyContent = 'flex-start';

    bubble.innerHTML = `
        <strong>Impressum:</strong> Paul-Vincent Langer, Am Grübl 5c, 82205 Gilching<br>
        <strong>Kontakt:</strong> support@wetterfroschwetter.de<br>
        <strong>Datenschutz:</strong> keine Datenspeicherung, keine Cookies, Wetterdaten von Open-Meteo.com.
    `;
});
