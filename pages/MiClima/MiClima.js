function actualizarHoraFija() {
    const opciones = {
      timeZone: 'America/Mexico_City', 
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };

    const formateador = new Intl.DateTimeFormat('es-MX', opciones);
    
    document.getElementById('reloj').textContent = formateador.format(new Date());
  }
  
  setInterval(actualizarHoraFija, 1000);
  actualizarHoraFija();