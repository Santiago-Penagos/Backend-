# Mapa de Basuras y Escombros - Frontend

## Correr en desarrollo local

1.  Iniciar un servidor HTTP simple en la carpeta `frontend/`:
    ```bash
    python -m http.server 5500
    ```
    Luego abrir `http://localhost:5500` en el navegador.

2.  Para cambiar entre datos simulados y la API real, edite `config.js`:
    - `USE_MOCK = true`: usa datos simulados en memoria (5 reportes de Bogotá). Ideal para desarrollo sin necesidad de la API levantada.
    - `USE_MOCK = false`: consume la API real en `/api/v1/reportes`.

## Arquitectura

El frontend está dividido en módulos ES sin dependencias externas:

- `config.js`: exporta `API_URL` y `USE_MOCK` (solo valores).
- `api/index.js`: switch runtime que selecciona entre `mockApi` y `reportesApi` según `USE_MOCK`.
- `main.js`: punto de entrada. Inicializa el mapa, carga reportes y maneja loading/error states.
- `map/mapView.js`: usa `L.geoJSON()` con `pointToLayer` para renderizar reportes en Leaflet sin conversiones manuales de coordenadas.
- `ui/mensajes.js`: muestra estados "Cargando...", éxito y error.
- `index.html`: estructura con mapa Leaflet y section de mensajes.
- `css/styles.css`: estilos mobile-first, mapa 100% height, overlay de carga.

## Verificación

- Con `USE_MOCK=true`: debe verse "Cargando..." y luego 5 marcadores con popup en Bogotá.
- Con `USE_MOCK=false`: si la API está disponible, se muestran los reportes reales; si no, un mensaje de error claro.
- Probar en desktop y en vista de celular (responsive design a partir de 640px).