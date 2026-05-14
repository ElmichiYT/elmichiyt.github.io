document.getElementById('searchBtn').addEventListener('click', fetchPlayer);

// Permitir buscar al presionar "Enter"
document.getElementById('usernameInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') fetchPlayer();
});

async function fetchPlayer() {
    const username = document.getElementById('usernameInput').value.trim();
    const card = document.getElementById('resultCard');
    const errorMsg = document.getElementById('errorMsg');

    if (!username) return;

    try {
        // En un entorno real, si la API tiene CORS bloqueado, 
        // podrías necesitar un proxy como https://cors-anywhere.herokuapp.com/
        const response = await fetch(`https://www.classicube.net/api/player/${username}`);
        const data = await response.json();

        if (data.error) {
            showError("Usuario no encontrado o error en la API.");
            return;
        }

        // Llenar los datos [cite: 1]
        document.getElementById('res-username').textContent = data.username;
        document.getElementById('res-id').textContent = `ID: ${data.id}`;
        document.getElementById('res-premium').textContent = data.premium ? "Sí ✅" : "No ❌";
        
        // Convertir Timestamp a fecha legible [cite: 1]
        const date = new Date(data.registered * 1000);
        document.getElementById('res-registered').textContent = date.toLocaleDateString();

        // Manejar los flags (si están vacíos) [cite: 1]
        document.getElementById('res-flags').textContent = data.flags.length > 0 ? data.flags.join(', ') : "Ninguno";

        // Mostrar tarjeta y ocultar errores
        card.classList.remove('hidden');
        errorMsg.classList.add('hidden');

    } catch (error) {
        showError("Hubo un problema al conectar con la API.");
        console.error(error);
    }
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMsg');
    const card = document.getElementById('resultCard');
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
    card.classList.add('hidden');
}