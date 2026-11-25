let callbacks = { onEnviar: () => {}, onCancelar: () => {} };
let elementos = null;

const obtenerElementos = () => {
  if (elementos) {
    return elementos;
  }
  elementos = {
    modal: document.getElementById('modal-reporte'),
    form: document.getElementById('form-reporte'),
    latitud: document.getElementById('latitud'),
    longitud: document.getElementById('longitud'),
    coordenadas: document.getElementById('coordenadas'),
    tipo: document.getElementById('tipo'),
    descripcion: document.getElementById('descripcion'),
    contador: document.getElementById('contador-descripcion')
  };
  return elementos;
};

const TIPOS_VALIDOS = ['basura', 'escombros', 'llantas', 'otro'];

const actualizarTextoCoordenadas = (el, lat, lng) => {
  el.coordenadas.textContent = `Lat: ${Number(lat).toFixed(6)}, Lng: ${Number(lng).toFixed(6)}`;
};

const limpiarErrores = () => {
  document.querySelectorAll('.error-campo').forEach((span) => {
    span.textContent = '';
  });
};

export const validarReporte = (datos) => {
  const errores = {};

  const latitudTexto = String(datos.latitud ?? '').trim();
  const latitud = Number(latitudTexto);
  if (latitudTexto === '' || !Number.isFinite(latitud) || latitud < -90 || latitud > 90) {
    errores.latitud = 'Debe ser un número entre -90 y 90';
  }

  const longitudTexto = String(datos.longitud ?? '').trim();
  const longitud = Number(longitudTexto);
  if (longitudTexto === '' || !Number.isFinite(longitud) || longitud < -180 || longitud > 180) {
    errores.longitud = 'Debe ser un número entre -180 y 180';
  }

  if (!TIPOS_VALIDOS.includes(datos.tipo)) {
    errores.tipo = 'Debe ser uno de: basura, escombros, llantas, otro';
  }

  const descripcion = String(datos.descripcion ?? '').trim();
  if (descripcion.length < 1 || descripcion.length > 300) {
    errores.descripcion = 'Debe tener entre 1 y 300 caracteres';
  }

  return { valido: Object.keys(errores).length === 0, errores };
};

export const mostrarErrores = (errores) => {
  Object.entries(errores).forEach(([campo, mensaje]) => {
    const span = document.getElementById(`error-${campo}`);
    if (span) {
      span.textContent = mensaje;
    }
  });
};

export const estaAbierto = () => !obtenerElementos().modal.classList.contains('oculto');

export const abrirFormulario = ({ lat, lng }) => {
  const el = obtenerElementos();
  el.latitud.value = String(lat);
  el.longitud.value = String(lng);
  actualizarTextoCoordenadas(el, lat, lng);
  el.modal.classList.remove('oculto');
  el.tipo.focus();
};

export const actualizarCoordenadas = ({ lat, lng }) => {
  const el = obtenerElementos();
  if (el.modal.classList.contains('oculto')) {
    return;
  }
  el.latitud.value = String(lat);
  el.longitud.value = String(lng);
  actualizarTextoCoordenadas(el, lat, lng);
};

export const cerrarFormulario = () => {
  const el = obtenerElementos();
  el.modal.classList.add('oculto');
  el.form.reset();
  el.latitud.value = '';
  el.longitud.value = '';
  el.coordenadas.textContent = '';
  el.contador.textContent = '0';
  limpiarErrores();
};

export const iniciarFormulario = ({ onEnviar, onCancelar }) => {
  callbacks = { onEnviar, onCancelar };
  const el = obtenerElementos();

  el.form.addEventListener('submit', (event) => {
    event.preventDefault();
    limpiarErrores();

    const datos = {
      latitud: el.latitud.value,
      longitud: el.longitud.value,
      tipo: el.tipo.value,
      descripcion: el.descripcion.value
    };

    const { valido, errores } = validarReporte(datos);
    if (!valido) {
      mostrarErrores(errores);
      return;
    }

    const formData = new FormData();
    formData.append('latitud', datos.latitud);
    formData.append('longitud', datos.longitud);
    formData.append('tipo', datos.tipo);
    formData.append('descripcion', datos.descripcion.trim());
    callbacks.onEnviar(formData);
  });

  el.form.querySelector('#btn-cancelar').addEventListener('click', () => {
    callbacks.onCancelar();
  });

  el.descripcion.addEventListener('input', () => {
    el.contador.textContent = String(el.descripcion.value.length);
  });
};
