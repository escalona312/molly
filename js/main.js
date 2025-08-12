document.addEventListener('DOMContentLoaded', function () {
  // Bloquear domingos y horas pasadas
  const fechaInput = document.getElementById('fecha');
  const horaSelect = document.getElementById('hora');
  function actualizarHorasDisponibles() {
    const hoy = new Date();
    const fechaSeleccionada = fechaInput.value ? new Date(fechaInput.value + 'T00:00:00') : null;
    const opciones = horaSelect.querySelectorAll('option');
    opciones.forEach(option => {
      option.disabled = false;
      if (!option.value) return;
      if (
        fechaSeleccionada &&
        fechaSeleccionada.getFullYear() === hoy.getFullYear() &&
        fechaSeleccionada.getMonth() === hoy.getMonth() &&
        fechaSeleccionada.getDate() === hoy.getDate()
      ) {
        // Solo bloquear horas pasadas si la fecha seleccionada es hoy
        let match = option.textContent.match(/(\d+):(\d+)\s*(am|pm)/i);
        if (!match) return;
        let [_, hora, minutos, ampm] = match;
        hora = parseInt(hora, 10);
        minutos = parseInt(minutos, 10);
        if (ampm.toLowerCase() === 'pm' && hora !== 12) hora += 12;
        if (ampm.toLowerCase() === 'am' && hora === 12) hora = 0;
        if (
          hora < hoy.getHours() ||
          (hora === hoy.getHours() && minutos <= hoy.getMinutes())
        ) {
          option.disabled = true;
        }
      } else {
        // Si no es hoy, todas las horas deben estar habilitadas
        option.disabled = false;
      }
    });
  }
  fechaInput.addEventListener('input', function () {
    const date = new Date(this.value);
    if (date.getDay() === 0) {
      alert('No se puede reservar los domingos. Por favor, elige otro día.');
      this.value = '';
    }
    actualizarHorasDisponibles();
  });
  horaSelect.addEventListener('focus', actualizarHorasDisponibles);

  const form = document.getElementById('reservaForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const servicio = document.getElementById('servicio').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    if (!nombre || !servicio || !fecha || !hora) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Construye el mensaje para WhatsApp y codifica correctamente
    const mensaje = `Hola, quiero reservar una hora en Nails by Molly:\nNombre: ${nombre}\nServicio: ${servicio}\nFecha: ${fecha}\nHora: ${hora}`;
    const numero = "56996361040"; // tu número sin +
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank');
  });
});