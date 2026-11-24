# Proposal

## Why

Esta captura la estructura frontend acordada en la sesión explore: separar config, API real/mock, mapView con Leaflet, y UI de mensajes. El objetivo es tener un frontend en JavaScript puro con ES modules donde mock y API real sean intercambiables sin tocar el resto del código. Esto cumple el principio SOLID de Dependencia Inversa y KISS "la solución más simple que funcione".

## What Changes

- Mover configuración a `config.js` que solo exporta valores (`API_URL`, `USE_MOCK`)
- Crear `api/index.js` como switch runtime que selecciona entre mock y API real según `USE_MOCK`
- `main.js` importa exclusivamente de `./api/index.js` y orquesta la app
- `mapView.js` usa `L.geoJSON()` con `pointToLayer` para que Leaflet maneje nativamente el orden `[lng, lat]` del GeoJSON
- `ui/mensajes.js` muestra estados "Cargando...", éxito y error
- `index.html` estructura básica con mapa y section mensajes; carga Leaflet por CDN
- `css/styles.css` estilos mobile-first, mapa 100% height, overlay de carga

**Fuera de alcance en este cambio**: formulario de reporte (POST /reportes con multipart/form-data), login admin, cambio de estado, eliminación de reportes, y fotos.

## Capabilities

### New Capabilities

- `frontend/estructura`: Estructura base del frontend (index.html, css, config, main, api, map, ui). Esta capacidad posee los requerimientos de tener un frontend en JavaScript puro con módulos ES donde la separación por capas cumple SOLID y KISS, y donde mock y API real son intercambiables mediante `USE_MOCK`.

### Modified Capabilities

*(ninguna - este es un cambio verdefield de la estructura base)*

## Impact

- Archivos tocados: `frontend/index.html`, `frontend/css/styles.css`, `frontend/config.js`, `frontend/main.js`, `frontend/api/index.js`, `frontend/api/mockApi.js`, `frontend/api/reportesApi.js`, `frontend/map/mapView.js`, `frontend/ui/mensajes.js`
- No hay dependencias externas nuevas; todo es JavaScript puro + Leaflet CDN
- La API real ya está definida en `docs/api-contract.md`; este cambio prepara el frontend para consumirla
- Dependencia de la capa `api`: el frontend depende de la API por HTTP/JSON, pero no de su implementación interna