async function updatePlayerCount() {
    const counterElement = document.getElementById('accounts');
    if (!counterElement) return;

    const PROXY_URL = "https://proxy.elmichiyt.workers.dev/";
    const API_URL = "https://www.classicube.net/api/players/";

    try {
        // Consultamos a través de tu proxy
        const response = await fetch(`${PROXY_URL}?url=${encodeURIComponent(API_URL)}`);
        
        if (!response.ok) throw new Error("Error en el proxy");

        const data = await response.json();

        // Según tu archivo de ejemplo, el campo es "playercount"
        if (data && data.playercount !== undefined) {
            // Formateamos el número para que tenga separador de miles (ej: 163,679)
            const formattedCount = new Intl.NumberFormat().format(data.playercount);
            
            counterElement.innerText = formattedCount;
        }
    } catch (error) {
        console.error("Error:", error);
        counterElement.innerText = "Error";
    }
}

// Ejecutar al cargar la página
updatePlayerCount();

// Opcional: Actualizar cada 60 segundos automáticamente
setInterval(updatePlayerCount, 10000);