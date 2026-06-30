const favicon = document.getElementById('dynamic-favicon');

function temaFavicon() {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (isDarkMode) {
    // favicon blanco
    favicon.href = 'https://elmichiyt.github.io/labs/assets/favicon/light.svg';
  } else {
    // favicon negro
    favicon.href = 'https://elmichiyt.github.io/labs/assets/favicon/dark.svg';
  }
}

// Ejecutar al cargar la página
temaFavicon();

// Escuchar si el usuario cambia el tema del sistema sin cerrar la pestaña
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', temaFavicon);