export const initMap = () => {
  const mapDiv = document.getElementById('map');
  const map = L.map('map').setView([4.6097, -74.0817], 12); // Bogotá, zoom 12

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const markersLayer = L.layerGroup().addTo(map);
  return { map, markersLayer };
};

export const renderReportes = (featureCollection, markersLayer) => {
  markersLayer.clearLayers();

  L.geoJSON(featureCollection, {
    pointToLayer: (feature, latlng) => L.marker(latlng).bindPopup(`
      <strong>ID: ${feature.properties.id}</strong><br/>
      <strong>Tipo: ${feature.properties.tipo}</strong><br/>
      <strong>Descripción: ${feature.properties.descripcion}</strong><br/>
      <strong>Estado: ${feature.properties.estado}</strong>
    `)
  }).addTo(markersLayer);
};