# Contrato de la API — Mapa de basuras y escombros

Acuerdo entre frontend y backend. **Nadie lo cambia sin avisar al otro.**
Base: `{API_URL}/api/v1` · Formato: JSON (salvo donde se indique) · Errores: `{"detail": "mensaje"}`

## Valores permitidos
- `tipo`: `basura` | `escombros` | `llantas` | `otro`
- `estado`: `reportado` | `en_atencion` | `limpiado`
- Fechas en ISO 8601 UTC, ej. `"2026-11-24T20:30:00Z"`

---

## 1. Salud
`GET /health` → `200`
```json
{ "status": "ok" }
```
El frontend lo usa para saber si la API ya despertó (Render la duerme tras 15 min).

## 2. Listar reportes (mapa)
`GET /reportes` → `200` · Filtro opcional: `?estado=reportado`

Responde **GeoJSON**. ⚠️ En GeoJSON las coordenadas van `[longitud, latitud]` (al revés de Leaflet).
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-74.0817, 4.6097] },
      "properties": {
        "id": 1,
        "tipo": "escombros",
        "descripcion": "Escombros en el andén frente al parque",
        "estado": "reportado",
        "tiene_foto": true,
        "creado_en": "2026-11-24T20:30:00Z"
      }
    }
  ]
}
```

## 3. Detalle de un reporte
`GET /reportes/{id}` → `200` | `404`
```json
{
  "id": 1,
  "latitud": 4.6097,
  "longitud": -74.0817,
  "tipo": "escombros",
  "descripcion": "Escombros en el andén frente al parque",
  "estado": "reportado",
  "foto_url": "/api/v1/reportes/1/foto",
  "creado_en": "2026-11-24T20:30:00Z",
  "actualizado_en": "2026-11-24T20:30:00Z"
}
```
`foto_url` es `null` si no tiene foto.

## 4. Crear reporte (ciudadano, sin login)
`POST /reportes` · **`multipart/form-data`** → `201` (devuelve el mismo objeto del punto 3) | `400` | `422`

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `latitud` | número | sí | entre -90 y 90 |
| `longitud` | número | sí | entre -180 y 180 |
| `tipo` | texto | sí | uno de los valores permitidos |
| `descripcion` | texto | sí | 1 a 300 caracteres |
| `foto` | archivo | no | JPG/PNG/WEBP, máx. 5 MB |

## 5. Foto de un reporte
`GET /reportes/{id}/foto` → `200` con `image/jpeg` | `404`

## 6. Login del administrador
`POST /auth/login` · JSON → `200` | `401`
```json
{ "usuario": "admin", "password": "secreto" }
```
Respuesta:
```json
{ "access_token": "eyJhbGciOi...", "token_type": "bearer" }
```
Las rutas de admin requieren el encabezado `Authorization: Bearer <access_token>`.

## 7. Cambiar estado (admin)
`PATCH /reportes/{id}/estado` · JSON · requiere token → `200` (objeto del punto 3) | `401` | `404` | `422`
```json
{ "estado": "en_atencion" }
```

## 8. Eliminar reporte (admin)
`DELETE /reportes/{id}` · requiere token → `204` | `401` | `404`

---

## Códigos de error
| Código | Cuándo |
|---|---|
| 400 | Archivo inválido o regla de negocio incumplida |
| 401 | Sin token, token vencido o credenciales malas |
| 404 | El reporte no existe |
| 422 | Datos con formato inválido (FastAPI devuelve `detail` como lista) |

## CORS
La API acepta peticiones desde la URL del Static Site de Render y desde `http://localhost:5500` (desarrollo del frontend).
