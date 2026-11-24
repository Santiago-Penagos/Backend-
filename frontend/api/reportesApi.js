export const getReportes = async () => {
  const response = await fetch('/api/v1/reportes');
  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudieron cargar los reportes`);
  }
  const data = await response.json();
  return data;
};