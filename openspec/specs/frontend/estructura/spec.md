# frontend/estructura Specification

## Purpose

Capacidad `frontend/estructura`: frontend en JavaScript puro con módulos ES donde config, API real/mock, mapView y mensajes están separados por capas, y mock/real son intercambiables mediante `USE_MOCK` sin tocar el resto del código. Cumple SOLID (DIP) y KISS "la solución más simple que funcione".

## Requirements

### Requirement: Estructura modular en JavaScript puro
The system SHALL provide a frontend structure using vanilla JavaScript ES modules where each module has a single responsibility.

#### Scenario: Config module exports only values
- **WHEN** `config.js` is imported
- **THEN** it provides `{ API_URL, USE_MOCK }` without importing any other modules

#### Scenario: api/index.js switches between mock and real API
- **WHEN** `USE_MOCK` is `true`
- **THEN** `api/index.js` imports from `./mockApi` and exports `api` object with `getReportes`
- **WHEN** `USE_MOCK` is `false`
- **THEN** `api/index.js` imports from `./reportesApi` and exports `api` object with `getReportes`

#### Scenario: main.js imports only from api/index.js
- **WHEN** `main.js` starts
- **THEN** it imports `{ getReportes } from './api/index.js'` and calls it to load reports

#### Scenario: mapView renders GeoJSON with Leaflet
- **WHEN** `mapView.js` receives `FeatureCollection` reportes
- **THEN** it uses `L.geoJSON(reportes, { pointToLayer: (f, l) => L.marker(l) })` and adds to map without manual coordinate conversion
- **THEN** Leaflet correctly places markers respecting GeoJSON `[lng, lat]` order

#### Scenario: mensajes.js shows loading and error states
- **WHEN** API request is in progress
- **THEN** `ui/mensajes.js` displays "Cargando..." message
- **WHEN** API returns error
- **THEN** `ui/mensajes.js` displays error message with appropriate detail

#### Scenario: mockApi returns FeatureCollection with 5 Bogotá reportes
- **WHEN** `mockApi.getReportes()` is called
- **THEN** it returns a `FeatureCollection` with exactly 5 features, each with `id`, `tipo`, `descripcion`, `estado`, `tiene_foto`, `creado_en` fields matching `docs/api-contract.md`
- **WHEN** `mockApi.getReportes()` is called
- **THEN** it simulates a 500ms delay with `await new Promise(r => setTimeout(r, 500))` before resolving

## Requirements coordination in ES modules

The system SHALL ensure that all import paths use `.js` extensions and there are no circular dependencies.

#### Scenario: config.js has no side-effect imports
- **WHEN** `config.js` is imported by any module
- **THEN** it only exports `API_URL` and `USE_MOCK` constants, no `import` statements

#### Scenario: api/index.js uses complete imports
- **WHEN** `api/index.js` is loaded
- **THEN** it imports `{ USE_MOCK } from '../config.js'`, `import * as mockApi from './mockApi.js'`, and `import * as reportesApi from './reportesApi.js'`
- **THEN** it exports `const api = USE_MOCK ? mockApi : reportesApi`

#### Scenario: main.js has single entry point
- **WHEN** `main.js` runs
- **THEN** it imports `{ getReportes } from './api/index.js'` and `import mapView from './map/mapView.js'` and `import mensajes from './ui/mensajes.js'`
- **THEN** it calls `getReportes()` then `mapView.render()` then `mensajes.showLoading()`