import { USE_MOCK } from '../config.js';

const reportes = [
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.0817, 4.6097] },
    properties: {
      id: 1,
      tipo: 'escombros',
      descripcion: 'Escombros en el andén frente al parque',
      estado: 'reportado',
      tiene_foto: true,
      creado_en: '2026-11-24T20:30:00Z'
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.05, 4.62] },
    properties: {
      id: 2,
      tipo: 'basura',
      descripcion: 'Basura en la calle 50 cerca de la tienda',
      estado: 'en_atencion',
      tiene_foto: false,
      creado_en: '2026-11-24T21:00:00Z'
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.09, 4.58] },
    properties: {
      id: 3,
      tipo: 'llantas',
      descripcion: 'Llantas abandonadas en el barrio',
      estado: 'limpiado',
      tiene_foto: true,
      creado_en: '2026-11-24T21:30:00Z'
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.07, 4.61] },
    properties: {
      id: 4,
      tipo: 'otro',
      descripcion: 'Residuos electrónicos en el contenedor',
      estado: 'reportado',
      tiene_foto: false,
      creado_en: '2026-11-24T22:00:00Z'
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.06, 4.63] },
    properties: {
      id: 5,
      tipo: 'escombros',
      descripcion: 'Escombros en la entrada del colegio',
      estado: 'en_atencion',
      tiene_foto: true,
      creado_en: '2026-11-24T22:30:00Z'
    }
  }
];

export const getReportes = async () => {
  // Simulate network delay of 500ms
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    type: 'FeatureCollection',
    features: reportes
  };
};