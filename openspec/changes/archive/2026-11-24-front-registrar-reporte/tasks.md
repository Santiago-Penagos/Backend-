# Tasks

> Importante: todos los archivos de `frontend/` YA EXISTEN desde el cambio front-estructura-y-mapa.
> Estas tareas AGREGAN o MODIFICAN funciones; no se debe borrar ni reescribir lo que ya funciona
> (por ejemplo `getReportes`, `initMap`, `renderReportes`, `showLoading`, `showSuccess`, `showError`).

## 1. api/mockApi.js (modificar)

- [x] 1.1 Agregar `crearReporte(formData)` sin tocar `getReportes()`:
    - Lee los campos con `formData.get('latitud')`, `formData.get('longitud')`, `formData.get('tipo')`, `formData.get('descripcion')` y convierte latitud/longitud a número
    - Asigna ID consecutivo (máximo id existente + 1)
    - Guarda el reporte en el arreglo en memoria para que `getReportes()` también lo devuelva como Feature GeoJSON
    - Simula 500 ms de retraso
    - Devuelve el objeto del punto 3 del contrato: `{id, latitud, longitud, tipo, descripcion, estado: "reportado", foto_url: null, creado_en, actualizado_en}`

## 2. api/reportesApi.js (modificar)

- [x] 2.1 Agregar `crearReporte(formData)` sin tocar `getReportes()`:
    - `fetch(\`${API_URL}/api/v1/reportes\`, { method: 'POST', body: formData })`
    - NO poner el header `Content-Type` (el navegador lo pone solo con FormData)
    - Si `!response.ok`: leer el JSON de error; si `detail` es texto, usarlo; si es lista (422 de FastAPI), usar `detail[0].msg`; lanzar `new Error(mensaje)`
    - Si la petición falla por red (fetch lanza TypeError), lanzar `new Error('No hay conexión con el servidor, intenta de nuevo')`
    - Si es ok, devolver el JSON (objeto del punto 3)
- [x] 2.2 Confirmar que `mockApi.crearReporte` y `reportesApi.crearReporte` reciben el mismo parámetro (FormData) y devuelven la misma estructura (Liskov)

## 3. map/mapView.js (modificar)

- [x] 3.1 Agregar `escaparHTML(texto)` (función interna, no exportada) que convierte `& < > " '` en entidades HTML
- [x] 3.2 Agregar `construirPopup(datos)` (interna) que recibe `{id, tipo, descripcion, estado}` y arma el HTML del popup usando `escaparHTML` en tipo, descripcion y estado (prevención de XSS)
- [x] 3.3 Modificar `renderReportes` para que use `construirPopup(feature.properties)` (DRY)
- [x] 3.4 Agregar y exportar `onMapClick(callback)` que llama `callback({lat, lng})` cuando el usuario hace clic en el mapa
- [x] 3.5 Agregar y exportar `mostrarMarcadorTemporal({lat, lng})`: crea un `L.circleMarker` naranja; si ya existe, lo mueve con `setLatLng`
- [x] 3.6 Agregar y exportar `quitarMarcadorTemporal()`
- [x] 3.7 Agregar y exportar `centrarMapa({lat, lng})`
- [x] 3.8 Agregar y exportar `agregarReporte(reporte)`: recibe el objeto del punto 3 y crea un marcador en `[reporte.latitud, reporte.longitud]` con popup de `construirPopup`
- [x] 3.9 mapView.js NO importa nada de `api/` ni de `ui/`

## 4. Formulario (index.html + styles.css + ui/formulario.js)

- [x] 4.1 En `index.html` agregar el HTML del modal (oculto por defecto): select `tipo` (basura, escombros, llantas, otro), textarea `descripcion` con `maxlength="300"` y contador, inputs ocultos `latitud` y `longitud`, texto que muestre las coordenadas, un espacio de error debajo de cada campo, botones "Cancelar" y "Crear reporte"
- [x] 4.2 En `styles.css` estilos del modal: en celular sale desde abajo (bottom sheet); desde 640 px es un modal centrado; z-index mayor que el mapa
- [x] 4.3 Crear `ui/formulario.js` que NO importa nada de `api/` ni de `map/`, con:
    - `validarReporte(datos)` exportada y pura: valida latitud (-90 a 90), longitud (-180 a 180), tipo permitido y descripcion de 1 a 300 caracteres (sin contar espacios al inicio y final); retorna `{valido, errores}`
    - `iniciarFormulario({ onEnviar, onCancelar })`: registra los callbacks y los eventos de los botones y del contador
    - `abrirFormulario({lat, lng})`: muestra el modal y llena latitud y longitud
    - `actualizarCoordenadas({lat, lng})`: actualiza latitud y longitud si el modal está abierto
    - `cerrarFormulario()`: oculta el modal, limpia campos, errores y contador
    - `mostrarErrores(errores)`: escribe cada mensaje debajo de su campo
    - `estaAbierto()`: retorna si el modal está visible
    - Al pulsar "Crear reporte": arma los datos, llama `validarReporte`; si no es válido llama `mostrarErrores`; si es válido construye un `FormData` y llama `onEnviar(formData)`
    - Al pulsar "Cancelar": llama `onCancelar()` (el formulario NO toca el mapa)

## 5. Botón flotante "📍 Usar mi ubicación"

- [x] 5.1 En `index.html` agregar el botón flotante (abajo a la derecha, encima del mapa)
- [x] 5.2 En `styles.css` estilos del botón: tamaño cómodo para el dedo en celular (mínimo 44 px de alto), z-index mayor que el mapa y que no tape los controles de Leaflet

## 6. main.js (modificar)

- [x] 6.1 Importar de `./map/mapView.js`: `initMap`, `renderReportes`, `onMapClick`, `mostrarMarcadorTemporal`, `quitarMarcadorTemporal`, `centrarMapa`, `agregarReporte` (NO `construirPopup`)
- [x] 6.2 Importar de `./ui/formulario.js`: `iniciarFormulario`, `abrirFormulario`, `actualizarCoordenadas`, `cerrarFormulario`, `mostrarErrores`, `estaAbierto`
- [x] 6.3 Clic en el mapa: `mostrarMarcadorTemporal(coords)`; si el formulario está abierto `actualizarCoordenadas(coords)`, si no `abrirFormulario(coords)`
- [x] 6.4 Botón de ubicación: solo al pulsarlo llamar `navigator.geolocation.getCurrentPosition` con timeout de 10 s
    - Éxito: `centrarMapa`, `mostrarMarcadorTemporal`, `abrirFormulario`
    - Permiso denegado: `showError('No se pudo acceder a la ubicación. Toca el mapa para marcar el punto.')`
    - Tiempo agotado u otro fallo: `showError('No se pudo obtener tu ubicación. Toca el mapa para marcar el punto.')`
    - NUNCA crear un marcador por defecto
- [x] 6.5 `onEnviar(formData)`: deshabilitar el botón "Crear reporte" mientras se envía; llamar `api.crearReporte(formData)`
    - Éxito: `cerrarFormulario()`, `quitarMarcadorTemporal()`, `agregarReporte(reporte)`, `showSuccess('Reporte creado')`
    - Error: `mostrarErrores({ general: error.message })` y el formulario sigue abierto con sus datos
    - Siempre: volver a habilitar el botón
- [x] 6.6 `onCancelar()`: `cerrarFormulario()` y `quitarMarcadorTemporal()`

## 7. Verificación manual (la hace la persona, no la IA)

- [x] 7.1 Con `USE_MOCK = true`: tocar el mapa → aparece círculo naranja y el formulario
- [x] 7.2 Con el formulario abierto, tocar otro punto → el círculo se mueve y cambian las coordenadas
- [x] 7.3 Enviar vacío → errores debajo de los campos; el contador llega a 300 y no deja escribir más
- [x] 7.4 Enviar válido → el formulario se cierra, aparece el marcador nuevo con su popup y el aviso de éxito
- [x] 7.5 Escribir `<b>hola</b>` en la descripción → el popup muestra el texto tal cual, sin negrita (XSS controlado)
- [x] 7.6 Botón de ubicación: permitir → centra y abre el formulario; bloquear el permiso → mensaje y ningún marcador
- [x] 7.7 Cancelar → se cierra el formulario y desaparece el círculo
- [x] 7.8 Con `USE_MOCK = false` (sin API) → al enviar sale el error de conexión y el formulario sigue abierto
- [x] 7.9 Repetir 7.1 a 7.7 en vista de celular (F12 → Ctrl + Shift + M)
- [x] 7.10 La consola no muestra errores en rojo con `USE_MOCK = true`
