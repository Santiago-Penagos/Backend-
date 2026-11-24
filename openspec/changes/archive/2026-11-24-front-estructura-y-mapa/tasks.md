# Tasks

## 1. Estructura base del frontend

- [x] 1.1 Crear `frontend/index.html` con estructura: header, div#map, section mensajes; cargar Leaflet CSS/JS por CDN; main.js con type="module"
- [x] 1.2 Crear `frontend/css/styles.css` con mobile-first: mapa 100% height, overlay "Cargando...", responsive >640px
- [x] 1.3 Crear `frontend/config.js` que exporte solo `API_URL` y `USE_MOCK` (solo valores, sin importar módulos)
- [x] 1.4 Crear `frontend/api/mockApi.js` con `FeatureCollection` de 5 reportes Bogotá; fetch con delay 500ms; mismas estructuras que `docs/api-contract.md`
- [x] 1.5 Crear `frontend/api/reportesApi.js` con fetch GET `/reportes` según contrato; formato GeoJSON (solo getReportes, sin POST)
- [x] 1.6 Crear `frontend/map/mapView.js` con `L.geoJSON(reportes, { pointToLayer: (f, l) => L.marker(l) })` — mapa OpenStreetMap a pantalla completa centrado en Bogotá; sin conversiones manuales de coordenadas
- [x] 1.7 Crear `frontend/ui/mensajes.js` que muestre "Cargando...", éxito y mensajes de error

## 2. Coordinación de importaciones y orquestación

- [x] 2.1 Crear `frontend/api/index.js` con importación completa desde `config.js`, `mockApi.js`, `reportesApi.js`; exportar `api = USE_MOCK ? mockApi : reportesApi`
- [x] 2.2 Crear `frontend/main.js` que importe `{ api } from './api/index.js'` y use `api.getReportes()`; además importa `mapView.js` y `mensajes.js` para orquestar la aplicación

## 3. README y verificación

- [x] 3.1 Crear `frontend/README.md` explicando cómo correrlo con `python -m http.server 5500` y cómo cambiar `USE_MOCK` en `config.js`
- [x] 3.2 Verificar con USE_MOCK=true: se muestra "Cargando..." y luego 5 marcadores con popup en Bogotá
- [x] 3.3 Verificar con USE_MOCK=false y sin API disponible: se muestra mensaje de error claro
- [x] 3.4 Probar en escritorio y en vista de celular (responsive design)