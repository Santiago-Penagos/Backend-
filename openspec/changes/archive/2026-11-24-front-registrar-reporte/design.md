# Design

## Context

Proyecto frontend en JavaScript puro con ES modules. Arquitectura de 3 capas: `/frontend` (presentación), `/api` (capa HTTP), `/backend` (núcleo Python). Regla de dependencias: frontend -> api -> backend/services -> backend/repositories (interfaz). `docs/api-contract.md` es la única fuente de verdad entre frontend y backend. `USE_MOCK` en `frontend/config.js` permite swapear mock/real sin tocar el resto.

## Goals / Non-Goals

**Goals:**
- Modal bottom sheet `ui/formulario.js` con formulario para crear reportes, validación pura `validarReporte(datos)` que retorna `{valido, errores}`, errores por campo.
- `mapView.js` con `onMapClick(callback)` que entrega `{lat, lng}`, `agregarReporte(reporte)` y `construirPopup(reporte)` única (DRY).
- `api/mockApi.crearReporte(formData)` que lee los campos con `formData.get()`, guarda en memoria y devuelve objeto contrato punto 3.
- `api/reportesApi.crearReporte(formData)` con `POST /reportes` y `multipart/form-data`.
- `main.js`Orquesta: geolocation al pulsar botón "Ubicación", modal, map events y API call.
- Marker temporal `L.circleMarker naranja` que dura hasta enviar o cancelar.
- Si el usuario toca otro punto, el marcador se mueve y se actualizan coordenadas.
- Geolocalización solo al pulsar botón; si falla/niega: mensaje + usuario toca mapa; NUNCA marcador por defecto en Bogotá.

**Non-Goals:**
- Subida de fotos de reportes.
- Login administrador, cambio de estado, eliminación de reportes.
- Cualquier librería framework (React, Vue, Svelte); vanilla JS solo.
- Geolocalización automática al cargar la página.

## Decisions

- **ui/formulario.js sin acoplamiento**: el módulo del formulario NO toca el mapa ni la API. Solo gestiona el DOM del modal, valida con `validarReporte(datos)` (función pura que retorna `{valido, errores}`, sin side effects, ubicada aquí) y notifica mediante callbacks `onEnviar(formData)` / `onCancelar()`. Cumple SRP; `main.js` es quien llama a la API y al mapa.
- **Ubicación de `validarReporte`**: dentro de `ui/formulario.js`, como función pura reutilizable por el propio módulo.
- **onMapClick(callback)**: entrega `{lat, lng}` (orden Leaflet), sin conversión a `[lng, lat]` para el formulario. El formulario envía latitud y longitud como campos separados.
- **construirPopup(reporte)**: función única en `mapView.js`, genera contenido desde `{id, tipo, descripcion, estado}`, reutilizable para reportes existentes y nuevos (DRY).
- **Marker temporal `L.circleMarker naranja`**: sin imágenes, solo style CSS. Dura hasta submit o Cancelar. Si usuario clicka otro punto, el marcador se mueve.
- **Geolocalización solo al pulsar botón**: Nunca en page load. Si falla/niega: mensaje + usuario toca mapa. NUNCA marcador por defecto en Bogotá.
- **Modal bottom sheet**: En celular sale desde abajo; en desktop es un modal centered.
- **Formulario se cierra completamente tras éxito**: No se resetea para otro reporte automáticamente; el formulario se cierra por completo, se limpian sus campos y se quita el marcador temporal.
- **El botón "Cancelar"**: Cierra modal y quita marcador temporal.

**Alternativas consideradas y desechadas:**
- Usar `import` condicional en JS (no es sintácticamente válido) → Solución: `api/index.js` con switch por `USE_MOCK`.
- Geolocalización automática al cargar página → Desechada por violar principio de sorpresa y permisos de usuario.
- Formulario que se resetea automáticamente tras éxito → Desechado por confusión de usuario; preferir cierre completo del formulario.

## Risks / Trade-offs

- [Risk] Si `validarReporte` tiene bug, ambos (mock y real) fallan igual. Mitigation: pruebas unitarias sencillas, función pura sin side effects.
- [Risk] Geolocalización puede fallar en entornos sin GPS (tablets sin GPS). Mitigation: mostrar un mensaje claro al usuario para que toque el mapa manualmente.
- [Trade-off] Marker temporal con `L.circleMarker` vs `L.marker` con icono personalizado. Elegido `circleMarker` por ser más simple y no requerir imágenes (KISS).
- [Trade-off] Formulario que se cierra completamente tras éxito vs. reseteo para otro reporte. Elegido cierre completo por claridad de usuario.

## Migration Plan

No aplica - es un cambio verde (nueva funcionalidad). Los archivos existentes en `frontend/` serán modificados según este diseño. No hay rollback necesario.

## Open Questions

None. All design decisions are resolved and documented above.