import { api } from './api/index.js';
import { initMap, renderReportes } from './map/mapView.js';
import { showLoading, showError, showSuccess } from './ui/mensajes.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Inicializar mapa y obtener la capa de marcadores
  const { map, markersLayer } = initMap();

  // Mostrar estado de carga
  showLoading();

  try {
    // Cargar reportes desde API (mock o real según USE_MOCK)
    // main.js es el único módulo que llama a api.getReportes()
    const reportes = await api.getReportes();

    // Pasar los datos y la capa a la función de renderizado
    renderReportes(reportes, markersLayer);

    showSuccess('Reportes cargados exitosamente');
  } catch (error) {
    showError(error);
  }
});