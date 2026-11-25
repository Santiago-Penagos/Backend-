# Proposal

## Why

Implementar la funcionalidad de crear reportes de basuras y escombros en el frontend, permitiendo a los usuarios registrar puntos en el mapa con tipo, descripción y ubicación. Esto completa el ciclo de MVP: ver reportes (ya implementado) + crear reportes. El frontend en JavaScript puro debe tener mock y API real intercambiables vía `USE_MOCK` sin tocar el resto del código.

## What Changes

- **Nueva capa `ui/formulario.js`**: Modal bottom sheet con formulario para crear reportes, validación pura `validarReporte(datos)`, renderizado de errores por campo.
- **Extensiones `map/mapView.js`**: `onMapClick(callback)`, `agregarReporte(reporte)`, `construirPopup(reporte)` (reutilizable DRY).
- **Nueva función `api/mockApi.crearReporte(datos)`**: Guarda en memoria, devuelve objeto contrato punto 3.
- **Extensión `api/reportesApi.crearReporte(formData)`**: Fetch `POST /reportes` con `multipart/form-data`.
- **Actualización `main.js`**: Orquestra geolocation, modal, map events y API call.
- **Fuera de alcance**: subida de fotos, panel de administrador, edición/borrado de reportes.

**Fuera de alcance en este cambio**: fotos de reportes, login admin, cambio de estado, eliminación de reportes, y cualquier lógica de negocio del backend.

## Capabilities

### New Capabilities

- `frontend/crear-reporte`: Capacidad de crear reportes de basuras con formulario modal, mapa interactivo y toggle mock/real. Esta capacidad posee los requerimientos de tener un formulario validado, marcadores temporales en el mapa, geolocalización bajo petición, y capacidad de intercambiar datos simulados por datos reales mediante `USE_MOCK` sin modificar el resto del código.

### Modified Capabilities

*(ninguna - este es un cambio verdefield de funcionalidad nueva)*

## Impact

- Archivos nuevos/Modificados: `frontend/ui/formulario.js`, `frontend/map/mapView.js` (agregando 3 funciones), `frontend/main.js` (orquestando geolocation + form + API), `frontend/api/mockApi.js` (agregando `crearReporte`), `frontend/api/reportesApi.js` (agregando `crearReporte`).
- No hay dependencias externas nuevas; todo es JavaScript puro + Leaflet CDN.
- El contrato de la API está en `docs/api-contract.md`; este cambio implementa el flujo de `POST /reportes`.
- Dependencia de la capa `api`: el frontend depende de la API por HTTP/JSON, pero no de su implementación interna (inyectada por `USE_MOCK`).
- Mock y API real son intercambiables sin tocar `main.js`, `mapView.js` ni `ui/`, cumpliendo DIP y KISS.

## Impact (Summary)

- Files touched: `frontend/ui/formulario.js` (nuevo), `frontend/map/mapView.js` (agregando funciones), `frontend/main.js` (actualizando orquestación), `frontend/api/mockApi.js` (agregando crearReporte), `frontend/api/reportesApi.js` (agregando crearReporte).
- No hay librerías externas nuevas; vanilla JS + Leaflet CDN.
- Implementa `POST /reportes` según `docs/api-contract.md` punto 4.
- DIP cumplida: `main.js` depende de abstracciones (api object, mapView functions, form element), no de implementaciones concretas.
- KISS: "la solución más simple que funcione" - sin frameworks, sin configuración compleja.