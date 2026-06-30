const elementosProtegidos = document.querySelectorAll('img');
    
    // Les aplica el bloqueo a cada uno automáticamente
    elementosProtegidos.forEach(elemento => {
        elemento.addEventListener('contextmenu', (e) => {
            e.preventDefault(); // Bloquea el menú desplegable
        });
    });