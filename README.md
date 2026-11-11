# Mapa měst ČR (Leaflet)

Jednoduchá webová mapa postavená na [Leafletu](https://leafletjs.com/). Body měst se načítají ze souboru GeoJSON.

## Struktura

| Soubor          | Účel                                          |
|-----------------|-----------------------------------------------|
| `index.html`    | Stránka, načítá Leaflet, styly a skript       |
| `map.js`        | Inicializace mapy, načtení GeoJSONu, popupy   |
| `styl.css`      | Vzhled stránky a popupů                       |
| `body.geojson`  | Data měst (Olomouc, Praha)                    |
| `README.md`     | Tento návod                                   |

## Spuštění

Prohlížeče blokují `fetch` ze souborů otevřených přes `file://`, proto je potřeba lokální server:

```bash
# Python 3
python -m http.server 8000
```

Poté otevřete <http://localhost:8000>.

Alternativy: `npx serve`, rozšíření Live Server ve VS Code apod.

Ke stažení Leafletu a dlaždic mapy je potřeba připojení k internetu.

## Formát dat

`body.geojson` je `FeatureCollection` s bodovými prvky. Každý bod má atributy:

- `id` – jedinečný identifikátor
- `nazev` – název města
- `popisek` – krátký popis zobrazený v popupu

**Pozor:** GeoJSON používá pořadí souřadnic `[délka, šířka]` (lon, lat), tedy např. `[17.2509, 49.5938]`.

## Přidání dalšího města

Do pole `features` v `body.geojson` přidejte nový objekt:

```json
{
  "type": "Feature",
  "properties": {
    "id": 3,
    "nazev": "Brno",
    "popisek": "Druhé největší město ČR."
  },
  "geometry": {
    "type": "Point",
    "coordinates": [16.6068, 49.1951]
  }
}
```

Mapa se po obnovení stránky automaticky přiblíží tak, aby byly vidět všechny body.

## Použité technologie

- Leaflet 1.9.4
- Podkladové dlaždice © přispěvatelé OpenStreetMap
