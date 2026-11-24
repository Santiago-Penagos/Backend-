export const showLoading = (mensaje = 'Cargando...') => {
  const section = document.getElementById('mensajes');
  section.innerHTML = `<div class="loading">${mensaje}</div>`;
  section.classList.add('visible');
};

export const showSuccess = (mensaje) => {
  const section = document.getElementById('mensajes');
  section.innerHTML = `<div class="success">${mensaje}</div>`;
  section.classList.add('visible');
  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    section.classList.remove('visible');
    section.innerHTML = '';
  }, 3000);
};

export const showError = (error) => {
  const section = document.getElementById('mensajes');
  section.innerHTML = `<div class="error">Error: ${error.detail || error.message || 'Error desconocido'}</div>`;
  section.classList.add('visible');
};