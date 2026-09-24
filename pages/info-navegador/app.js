// Cargamos todos los valores
// ########################################
// Hardware
const Cores = navigator.hardwareConcurrency;
const RAM = navigator.deviceMemory;
const Battery = navigator.getBattery();

// Red y Conexión
const Connection = navigator.onLine;
const ConnectionType = navigator.connection.effectiveType;
const latency = navigator.connection.rtt;

// Sistema y Navegador
const lang = navigator.language;
const UA = navigator.userAgent;
const darkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Pantalla y Ventana
const screenWidth = screen.width;
const screenHeight = screen.height;
const winWidth = window.innerWidth;
const winHeight = window.innerHeight;
const orientation = screen.orientation.type;

// ########################################
// Cargar todos los IDs de el HTML para acá
// ########################################

// Hardware
const nucleosInput = document.getElementById('nucleos');
const RAMInput = document.getElementById('RAM');
const bateriaInput = document.getElementById('bateria');

// Red
const internetInput = document.getElementById('internet');
const conexionInput = document.getElementById('conexion');
const pingInput = document.getElementById('ping');

// Sistema y Navegador
const idiomaInput = document.getElementById('idioma');
const uaInput = document.getElementById('ua');
const darkthemeInput = document.getElementById('darktheme');

// Pantalla y Ventana
const pantallaInput = document.getElementById('pantalla');
const ventanaActivaInput = document.getElementById('ventana-activa');
const orientaInput = document.getElementById('orienta');

// Asignar los valores al HTML
nucleosInput.innerText = Cores;
RAMInput.innerText = RAM + "GB";
Battery.then(b => bateriaInput.innerText = b.level * 100 + "%");

internetInput.innerText = Connection;
conexionInput.innerText = ConnectionType;
pingInput.innerText = latency;

idiomaInput.innerText = lang;
uaInput.innerText = UA;
darkthemeInput.innerText = darkTheme;

pantallaInput.innerText = screenWidth + " x " + screenHeight;
ventanaActivaInput.innerText = winWidth + " x " + winHeight;
orientaInput.innerText = orientation;