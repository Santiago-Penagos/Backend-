# frontend/crear-reporte Specification

## Purpose

Capacidad `frontend/crear-reporte`: frontend en JavaScript puro con módulos ES donde el usuario puede crear reportes mediante un formulario modal, geolocalización bajo petición y marcadores temporales. Mock y API real son intercambiables mediante `USE_MOCK` sin tocar el resto del código. Cumple SOLID (Liskov: `mockApi.crearReporte` y `reportesApi.crearReporte` reciben `FormData` y devuelven el objeto del punto 3 del contrato) y KISS "la solución más simple que funcione".

## Requirements

### Requirement: Formulario modal con validación pura
The system SHALL provide a modal bottom sheet form in `ui/formulario.js` with pure validation function `validarReporte(datos)` that returns `{valido, errores}`. `ui/formulario.js` SHALL NOT touch the map nor the API; it SHALL only manage its own DOM, validate, and notify through the callbacks `onEnviar(formData)` / `onCancelar()`.

#### Scenario: Formulario con datos inválidos
- **WHEN** el usuario envía el formulario sin completar campos requeridos
- **THEN** `validarReporte` retorna `{valido: false, errores: {campo: "mensaje"}}` y se muestran errores debajo de cada campo

#### Scenario: Formulario con datos válidos
- **WHEN** `validarReporte(datos)` retorna `{valido: true, errores: {}}`
- **THEN** el formulario construye un `FormData` y llama `onEnviar(formData)` (no llama a la API directamente)

#### Scenario: Validación de latitud fuera de rango
- **WHEN** `latitud` es menor que -90 o mayor que 90
- **THEN** `validarReporte` retorna error: `"latitud": "Debe ser un número entre -90 y 90"`

#### Scenario: Validación de longitud fuera de rango
- **WHEN** `longitud` es menor que -180 o mayor que 180
- **THEN** `validarReporte` retorna error: `"longitud": "Debe ser un número entre -180 y 180"`

#### Scenario: Validación de tipo inválido
- **WHEN** `tipo` no es uno de: `basura`, `escombros`, `llantas`, `otro`
- **THEN** `validarReporte` retorna error: `"tipo": "Debe ser uno de: basura, escombros, llantas, otro"`

#### Scenario: Validación de descripción fuera de rango
- **WHEN** `descripcion` tiene menos de 1 carácter o más de 300 (sin contar espacios al inicio y final)
- **THEN** `validarReporte` retorna error: `"descripcion": "Debe tener entre 1 y 300 caracteres"`

### Requirement: Mostrar marcador temporal al hacer click en el mapa
The system SHALL display a temporary orange `L.circleMarker` at the map click location, removable by cancelling or submitting the form. `mapView.js` SHALL export `onMapClick`, `mostrarMarcadorTemporal`, `quitarMarcadorTemporal`, `centrarMapa` y `agregarReporte`.

#### Scenario: Click en mapa muestra marcador temporal
- **WHEN** el usuario hace click en el mapa
- **THEN** se muestra un `L.circleMarker` naranja en la posición clickada
- **Y** `onMapClick(callback)` entrega `{lat, lng}`

#### Scenario: Tocar otro punto mueve el marcador temporal
- **WHEN** el usuario hace click en otro lugar del mapa
- **THEN** `mostrarMarcadorTemporal({lat, lng})` mueve el marcador existente a la nueva posición y se actualizan las coordenadas en el formulario

#### Scenario: Cancelar quita el marcador temporal
- **WHEN** el usuario pulsa "Cancelar"
- **THEN** `onCancelar()` se invoca y `quitarMarcadorTemporal()` elimina el círculo naranja

### Requirement: Geolocalización al pulsar botón "Ubicación"
The system SHALL request geolocation only when the user taps the floating "📍 Usar mi ubicación" button, never on page load.

#### Scenario: Geolocalización exitosa
- **WHEN** el usuario pulsa el botón "📍 Usar mi ubicación" y concede permiso
- **THEN** `centrarMapa({lat, lng})` centra el mapa y `mostrarMarcadorTemporal({lat, lng})` muestra el marcador temporal

#### Scenario: Geolocalización denegada
- **WHEN** el usuario niega el permiso de geolocalización
- **THEN** se muestra un mensaje "No se pudo acceder a la ubicación" y NUNCA se crea un marcador por defecto

#### Scenario: Fallo de geolocalización
- **WHEN** el usuario pulsa el botón y el tiempo se agota
- **THEN** se muestra "Tiempo agotado" y NUNCA se crea un marcador por defecto

### Requirement: Submit del formulario crea reporte
The system SHALL send the form data to the API and, on success, close the modal, clear the form, and add the new marker to the map.

#### Scenario: Éxito al crear reporte
- **WHEN** `api.crearReporte(formData)` retorna éxito (201)
- **THEN** el modal se cierra, los campos se limpian, `quitarMarcadorTemporal()` se llama y `agregarReporte(reporte)` se llama con el objeto del punto 3 del contrato

#### Scenario: Éxito con mockApi
- **WHEN** `USE_MOCK = true` y `mockApi.crearReporte(formData)` es llamado
- **THEN** lee los campos con `formData.get()`, guarda en memoria, asigna ID consecutivo y devuelve el objeto del punto 3: `{id, latitud, longitud, tipo, descripcion, estado: "reportado", foto_url: null, creado_en, actualizado_en}`

#### Scenario: Éxito con API real
- **WHEN** `USE_MOCK = false` y `reportesApi.crearReporte(formData)` es llamado
- **THEN** hace `fetch` `POST /reportes` con `multipart/form-data` (sin poner el header `Content-Type` manualmente) y retorna 201 con el objeto del punto 3

#### Scenario: Error de validación (400/422)
- **WHEN** la API retorna 400 o 422
- **THEN** `reportesApi.crearReporte` lee el JSON de error: si `detail` es texto lo usa, si `detail` es lista (422 de FastAPI) usa `detail[0].msg`, y lanza `new Error(mensaje)`; el mensaje se muestra en el formulario, que se mantiene abierto y conserva los datos

#### Scenario: Error de red
- **WHEN** falla la conexión con el servidor (fetch lanza `TypeError`)
- **THEN** se muestra "No hay conexión con el servidor, intenta de nuevo" y el formulario se mantiene abierto

### Requirement: Popup reutilizable para reportes
The system SHALL use a single internal `construirPopup(reporte)` function in `mapView.js` that generates popup content from a reporte object, reusable for both existing and new reportes, escaping all user-provided text to prevent XSS.

#### Scenario: Popup reutilizable
- **WHEN** `construirPopup(reporte)` es llamado con un objeto `{id, tipo, descripcion, estado}`
- **THEN** retorna el HTML del popup con `id`, `tipo`, `descripcion` y `estado`
- **Y** este mismo contenido se usa para los marcadores existentes (`renderReportes`) y el nuevo reporte creado

#### Scenario: Texto del usuario escapado (XSS)
- **WHEN** la `descripcion` de un reporte contiene `<b>hola</b>`
- **THEN** el popup muestra el texto literal `<b>hola</b>` sin interpretarlo como HTML (no aparece en negrita)
