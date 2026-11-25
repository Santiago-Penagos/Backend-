let map;
let markersLayer;
let marcadorTemporal = null;

const escaparHTML = (texto) => String(texto ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const construirPopup = ({ id, tipo, descripcion, estado }) => `
  <strong>ID: ${escaparHTML(id)}</strong><br/>
  <strong>Tipo: ${escaparHTML(tipo)}</strong><br/>
  <strong>Descripción: ${escaparHTML(descripcion)}</strong><br/>
  <strong>Estado: ${escaparHTML(estado)}</strong>
`;

export const initMap = () => {
  map = L.map('map').setView([4.6097, -74.0817], 12); // Bogotá, zoom 12

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
  return { map, markersLayer };
};

export const renderReportes = (featureCollection, layer) => {
  layer.clearLayers();

  L.geoJSON(featureCollection, {
    pointToLayer: (feature, latlng) => L.marker(latlng).bindPopup(construirPopup(feature.properties))
  }).addTo(layer);
};

export const onMapClick = (callback) => {
  map.on('click', (event) => {
    callback({ lat: event.latlng.lat, lng: event.latlng.lng });
  });
};

export const mostrarMarcadorTemporal = ({ lat, lng }) => {
  if (marcadorTemporal) {
    marcadorTemporal.setLatLng([lat, lng]);
    return;
  }

  marcadorTemporal = L.circleMarker([lat, lng], {
    radius: 10,
    color: '#e67e22',
    fillColor: '#e67e22',
    fillOpacity: 0.9
  }).addTo(map);
};

export const quitarMarcadorTemporal = () => {
  if (marcadorTemporal) {
    map.removeLayer(marcadorTemporal);
    marcadorTemporal = null;
  }
};

export const centrarMapa = ({ lat, lng }) => {
  map.setView([lat, lng], map.getZoom());
};

export const agregarReporte = (reporte) => {
  const marker = L.marker([reporte.latitud, reporte.longitud])
    .bindPopup(construirPopup(reporte));
  marker.addTo(markersLayer);
  return marker;
};
