// Inicializace mapy (výchozí pohled na střed ČR)
const mapa = L.map('mapa').setView([49.8175, 15.473], 7);
 
const esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services';
const esriAttr = 'Tiles &copy; Esri';
 
// Světle šedý podklad + popisky (popisky jsou samostatná vrstva)
const sedaPodklad = L.tileLayer(
  `${esriUrl}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
  {
    maxZoom: 16,
    attribution: `${esriAttr} &mdash; HERE, DeLorme, &copy; OpenStreetMap přispěvatelé`
  }
);
const sedePopisky = L.tileLayer(
  `${esriUrl}/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
  { maxZoom: 16 }
);
const seda = L.layerGroup([sedaPodklad, sedePopisky]);
 
// Další podklady k vyzkoušení
const ulice = L.tileLayer(
  `${esriUrl}/World_Street_Map/MapServer/tile/{z}/{y}/{x}`,
  { maxZoom: 18, attribution: esriAttr }
);
 
const topo = L.tileLayer(
  `${esriUrl}/World_Topo_Map/MapServer/tile/{z}/{y}/{x}`,
  { maxZoom: 18, attribution: esriAttr }
);
 
const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> přispěvatelé'
});
 
// Výchozí vrstva
seda.addTo(mapa);
 
// Přepínač podkladů v pravém horním rohu
L.control.layers({
  'Světle šedá (Esri)': seda,
  'Ulice (Esri)': ulice,
  'Topografická (Esri)': topo,
  'OpenStreetMap': osm
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
 