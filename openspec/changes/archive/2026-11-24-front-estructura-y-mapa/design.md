# Design

## Context

Proyecto frontend en JavaScript puro con ES modules. Arquitectura de 3 capas: `/frontend` (presentación), `/api` (capa HTTP), `/backend` (núcleo Python). Regla de dependencias: frontend -> api -> backend/services -> backend/repositories (interfaz). Ningún cambio puede contradecir `docs/api-contract.md`.

## Goals / Non-Goals

**Goals:**
- Estructura frontend donde config, API real/mock, mapView y mensajes están separados en módulos ES
- `USE_MOCK` toggle en `config.js` permita swapear entre datos simulados y API real sin tocar `main.js`, `mapView.js` ni `ui/`
- Leaflet renderizar `FeatureCollection` geojson nativamente con `pointToLayer` sin conversiones manuales de coordenadas
- Mobile-first responsive design con mapa a pantalla completa
- Mostrar estado "Cargando..." mientras la API despierta en Render

**Non-Goals:**
- Formulario de creación de reporte (POST /reportes multipart/form-data) - pendiente siguiente cambio
- Login administrador, cambio de estado, eliminación de reportes
- Fotos de reportes (subida y almacenamiento)
- Cualquier librería framework (React, Vue, Svelte); vanilla JS solo

## Decisions

- **config.js como valores puros**: exportar solo `API_URL` y `USE_MOCK`; sin importar módulos. Esto evita dependencias circulares y cumple DIP (depender de abstracciones, no implementaciones).
- **api/index.js como switch runtime**: usar `import *` desde `config.js`, `mockApi.js` y `reportesApi.js`; exportar `api` condicional por tiempo de ejecución. `main.js` importa únicamente de `./api/index.js`.
- **mapView.js usa L.geoJSON con pointToLayer**: Leaflet maneja el orden `[lng, lat]` del GeoJSON internamente; `pointToLayer: (f, l) => L.marker(l)` crea el marcador sin conversiones manuales. Esto satisface KISS "la solución más simple que funcione".
- **mockApi.jsFeatureCollection idéntica al contrato**: mismas estructuras (`id`, `tipo`, `descripcion`, `estado`, `tiene_foto`, `creado_en`) + delay 500ms para probar estado "Cargando...".
- **ui/mensajes.js solo mensajes**: mostrar "Cargando...", éxito y errores; formulario separado en cambio futuro.
- **index.html carga Leaflet por CDN**: `<link rel="stylesheet" ...>` + `<script src="...">`; `main.js` con `type="module"`.

**Alternativa descartada**: No usar `import` condicional en JS (no es sintácticamente válida). La solución de `api/index.js` con importaciones completas y switch por `USE_MOCK` es el patrón más simple.

## Risks / Trade-offs

- [Risk] Si `USE_MOCK` y `reportesApi` tienen firmas diferentes, el toggle fallaría. Mitigation: mantener firma idéntica en ambos módulos (mismo nombres de función: `getReportes`).
- [Risk] Leaflet `pointToLayer` recibe latlng en orden inverso al GeoJSON. Mitigation: la función `pointToLayer` en nuestro código simplemente pasa las coordenadas a `L.marker()`; Leaflet internamente usa `[lat, lng]`, resolviendo el problema.
- [Trade-off] Usar `import *` en lugar de named imports reduce la tree-shaking, pero para vanilla JS ES modules en un cambio pequeño esto es aceptable (KISS).

## Migration Plan

No aplica - es un cambio verde (nueva estructura). Los archivos existentes en `frontend/` serán reorganizados según este diseño. No hay rollback necesario.

## Open Questions

None. All design decisions are resolved and documented above.