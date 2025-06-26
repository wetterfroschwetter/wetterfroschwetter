const lat = 48.56;
const lon = 13.43;

fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
  .then(response => response.json())
  .then(data => {
    const temp = data.current_weather.temperature;
    document.getElementById('temperature').textContent = `Aktuelle Temperatur: ${temp}°C`;
  })
  .catch(error => {
    console.error('Fehler beim Abrufen der Wetterdaten:', error);
    document.getElementById('temperature').textContent = 'Wetterdaten nicht verfügbar';
  });
