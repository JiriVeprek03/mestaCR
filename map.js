// Inicializace mapy (výchozí pohled na střed ČR)
const mapa = L.map('mapa').setView([49.8175, 15.473], 7);

// Světle šedá podkladová vrstva (CARTO Positron)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  subdomains: 'abcd',
  maxZoom: 20,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> přispěvatelé ' +
    '&copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(mapa);

// Ochrana proti vložení HTML z dat do popupu
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

// Popup pro každý bod
function pridejPopup(feature, layer) {
  const { id, nazev, popisek } = feature.properties;

  layer.bindPopup(
    `<div class="popup">
       <h2>${escapeHtml(nazev)}</h2>
       <p>${escapeHtml(popisek)}</p>
       <p class="id">ID: ${escapeHtml(String(id))}</p>
     </div>`
  );

  layer.bindTooltip(escapeHtml(nazev));
}

// Načtení GeoJSONu a vykreslení bodů
fetch('body.geojson')
  .then(odpoved => {
    if (!odpoved.ok) {
      throw new Error(`HTTP ${odpoved.status}`);
    }
    return odpoved.json();
  })
  .then(data => {
    const vrstva = L.geoJSON(data, { onEachFeature: pridejPopup }).addTo(mapa);

    // Přiblížení mapy tak, aby byly vidět všechny body
    if (vrstva.getBounds().isValid()) {
      mapa.fitBounds(vrstva.getBounds(), { padding: [50, 50] });
    }
  })
  .catch(chyba => {
    console.error('Nepodařilo se načíst body.geojson:', chyba);
    alert(
      'Nepodařilo se načíst data. Pokud stránku otevíráte přímo ze souboru, ' +
      'spusťte lokální server (viz README).'
    );
  });