const searchBtn = document.getElementById('searchBtn');
const usernameInput = document.getElementById('usernameInput');
const card = document.getElementById('resultCard');
const errorMsg = document.getElementById('errorMsg');

const PROXY_URL = "https://proxy.elmichiyt.workers.dev/"; // TU URL AQUÍ

searchBtn.addEventListener('click', fetchPlayer);
usernameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') fetchPlayer(); });

async function fetchPlayer() {
    const user = usernameInput.value.trim();
    if (!user) return;

    // Estado inicial
    card.style.display = "none";
    errorMsg.style.display = "none";
    searchBtn.disabled = true;
    searchBtn.innerText = "Buscando...";

    const targetApi = `https://www.classicube.net/api/player/${encodeURIComponent(user)}`;

    try {
        const response = await fetch(`${PROXY_URL}?url=${encodeURIComponent(targetApi)}`);
        
        if (!response.ok) throw new Error("Error en la conexión con el proxy.");
        
        const data = await response.json();

        // Validar si la API de ClassiCube devolvió un error (campo error en el JSON)
        if (data.error && data.error !== "") {
            showError(`Error de ClassiCube: ${data.error}`);
            return;
        }
		
		// --- NUEVA LÓGICA PARA EL AVATAR ---
        const avatarImg = document.getElementById('res-avatar');
        const playerUsername = data.username || user; // Usamos el nombre exacto de la API

        avatarImg.src = `https://cdn.classicube.net/face/${playerUsername}.png`;
        avatarImg.style.display = "block";
        // ----------------------------------

        // Renderizar datos del JSON proporcionado 
        document.getElementById('res-username').innerText = data.username || "N/A";
        document.getElementById('res-id').innerText = `ID: ${data.id}`;
        
        // Premium
        document.getElementById('res-premium').innerText = data.premium ? "true" : "false";
        
        // Fecha de registro (Unix Timestamp)
        if (data.registered) {
            const date = new Date(data.registered * 1000);
            document.getElementById('res-registered').innerText = date.toLocaleDateString();
        }

        // Flags
        const flags = (data.flags && data.flags.length > 0) ? data.flags.join(', ') : "null";
        document.getElementById('res-flags').innerText = flags;

        // Mostrar resultado
        card.style.display = "block";

    } catch (err) {
        showError("No se pudo obtener la información. Verifica la URL del Worker o el usuario.");
        console.error(err);
    } finally {
        searchBtn.disabled = false;
        searchBtn.innerText = "Buscar";
    }
}

function showError(text) {
    errorMsg.innerText = text;
    errorMsg.style.display = "block";
}