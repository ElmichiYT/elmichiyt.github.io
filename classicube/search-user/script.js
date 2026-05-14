document.getElementById('fetch-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value.trim();
    const resultDiv = document.getElementById('result');
    const errorMsg = document.getElementById('error-msg');

    if (!username) return;

    // La URL de la API
    const url = `https://www.classicube.net/api/player/${username}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error en la red');
            return response.json();
        })
        .then(data => {
            if (data.error) {
                showError();
            } else {
                // Llenar los datos en el HTML
                document.getElementById('res-name').innerText = data.username;
                document.getElementById('res-id').innerText = data.id;
                document.getElementById('res-registered').innerText = new Date(data.registered * 1000).toLocaleDateString();
                document.getElementById('res-flags').innerText = data.flags || "Usuario estándar";
                
                resultDiv.classList.remove('hidden');
                errorMsg.classList.add('hidden');
            }
        })
        .catch(err => {
            console.error(err);
            showError();
        });
});

function showError() {
    document.getElementById('result').classList.add('hidden');
    document.getElementById('error-msg').classList.remove('hidden');
}