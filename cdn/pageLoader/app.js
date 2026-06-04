// loader.js

window.addEventListener('load', () => {
  const loader = document.getElementById('pantalla-carga');
  
  if (loader) {
    // Le añadimos la clase que lo desvanece
    loader.classList.add('oculto');
    
    // Lo eliminamos del DOM tras la animación
    setTimeout(() => {
      loader.remove();
    }, 500); // Debe coincidir con los 0.5s del CSS
  }
});