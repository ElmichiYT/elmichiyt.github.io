document.getElementById('fetch-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value.trim();
    const resultDiv = document.getElementById('result');
    const errorMsg = document.getElementById('error-msg');

    if (!username) return;

    // URL de la API de ClassiCube
    const url = `https://www.classicube.net/api/player/${username}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Si la API devuelve un error o el usuario no existe
            if (data.error && data.error !== "") {
                showError(data.error);
            } else {
                // 1. Nombre y Forum Title
                document.getElementById('res-name').innerText = data.username;
                
                // 2. ID de usuario
                document.getElementById('res-id').innerText = data.id;

                // 3. Convertir Timestamp a fecha legible
                const date = new Date(data.registered * 1000);
                document.getElementById('res-registered').innerText = date.toLocaleDateString();

                // 4. Manejar Flags (rangos)
                const flags = data.flags.length > 0 ? data.flags.join(', ') : "Jugador estándar";
                document.getElementById('res-flags').innerText = flags;

                // 5. Bonus: ¿Es Premium?
                const premiumStatus = data.premium ? "✅ Sí" : "❌ No";
                // Si quieres mostrarlo, añade un <span id="res-premium"></span> en tu HTML
                if(document.getElementById('res-premium')) {
                    document.getElementById('res-premium').innerText = premiumStatus;
                }

                resultDiv.classList.remove('hidden');
                errorMsg.classList.add('hidden');
            }
        })
        .catch(err => {
            console.error("Error al conectar con la API:", err);
            showError("Error de conexión (posible bloqueo de CORS)");
        });
});

function showError(msg) {
    const errorMsg = document.getElementById('error-msg');
    errorMsg.innerText = msg;
    document.getElementById('result').classList.add('hidden');
    errorMsg.classList.remove('hidden');
}