import { api } from './api/index.js';
import {
  initMap,
  renderReportes,
  onMapClick,
  mostrarMarcadorTemporal,
  quitarMarcadorTemporal,
  centrarMapa,
  agregarReporte
} from './map/mapView.js';
import {
  iniciarFormulario,
  abrirFormulario,
  actualizarCoordenadas,
  cerrarFormulario,
  mostrarErrores,
  estaAbierto
} from './ui/formulario.js';
import { showLoading, showError, showSuccess } from './ui/mensajes.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Inicializar mapa y obtener la capa de marcadores
  const { map, markersLayer } = initMap();

  iniciarFormulario({
    onEnviar: async (formData) => {
      const boton = document.getElementById('btn-crear');
      if (boton) {
        boton.disabled = true;
      }

      try {
        const reporte = await api.crearReporte(formData);
        cerrarFormulario();
        quitarMarcadorTemporal();
        agregarReporte(reporte);
        showSuccess('Reporte creado');
      } catch (error) {
        mostrarErrores({ general: error.message || 'No se pudo crear el reporte' });
      } finally {
        if (boton) {
          boton.disabled = false;
        }
      }
    },
    onCancelar: () => {
      cerrarFormulario();
      quitarMarcadorTemporal();
    }
  });

  onMapClick((coords) => {
    mostrarMarcadorTemporal(coords);
    if (estaAbierto()) {
      actualizarCoordenadas(coords);
    } else {
      abrirFormulario(coords);
    }
  });

  document.getElementById('btn-ubicacion').addEventListener('click', () => {
    if (!navigator.geolocation) {
      showError({ message: 'No se pudo obtener tu ubicación. Toca el mapa para marcar el punto.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        centrarMapa(coords);
        mostrarMarcadorTemporal(coords);
        abrirFormulario(coords);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          showError({ message: 'No se pudo acceder a la ubicación. Toca el mapa para marcar el punto.' });
        } else {
          showError({ message: 'No se pudo obtener tu ubicación. Toca el mapa para marcar el punto.' });
        }
      },
      { timeout: 10000 }
    );
  });

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
