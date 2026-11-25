import { API_URL } from '../config.js';

export const getReportes = async () => {
  const response = await fetch(`${API_URL}/api/v1/reportes`);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudieron cargar los reportes`);
  }
  const data = await response.json();
  return data;
};

const extraerMensajeError = async (response) => {
  try {
    const data = await response.json();
    if (Array.isArray(data.detail)) {
      return data.detail[0]?.msg || `Error ${response.status}: No se pudo crear el reporte`;
    }
    if (data.detail) {
      return data.detail;
    }
  } catch (_) {
    // La respuesta no traía JSON; se usa el mensaje por defecto
  }
  return `Error ${response.status}: No se pudo crear el reporte`;
};

export const crearReporte = async (formData) => {
  let response;
  try {
    response = await fetch(`${API_URL}/api/v1/reportes`, {
      method: 'POST',
      body: formData
    });
  } catch (_) {
    throw new Error('No hay conexión con el servidor, intenta de nuevo');
  }

  if (!response.ok) {
    const mensaje = await extraerMensajeError(response);
    throw new Error(mensaje);
  }

  return response.json();
};