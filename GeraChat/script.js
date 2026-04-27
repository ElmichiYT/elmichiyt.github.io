import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getDatabase, ref, set, onValue, push, onDisconnect, query, orderByChild, equalTo, get, update } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC__aSrA3MNqUfLsSq-S4Jt-eN1lqSyhTw",
    authDomain: "gerachat-server.firebaseapp.com",
    projectId: "gerachat-server",
    storageBucket: "gerachat-server.firebasestorage.app",
    messagingSenderId: "522028723130",
    appId: "1:522028723130:web:5fe73995cf0d0f9e184b83",
    measurementId: "G-L0P1GLB0JN"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let player = { id: Date.now(), x: 400, y: 250, color: '#3498db', name: "Invitado" };

window.navegar = (idA, idB) => {
    document.getElementById(`menu-${idA}`).classList.remove('active');
    document.getElementById(`menu-${idB}`).classList.add('active');
};

document.getElementById('btn-unirse').onclick = async () => {
    const nombre = document.getElementById('username').value.trim();
    if(!nombre) return;
    const snap = await get(query(ref(db, 'jugadores'), orderByChild('name'), equalTo(nombre)));
    if(snap.exists()) {
        document.getElementById('error-msg').innerText = "Nombre ocupado.";
    } else {
        iniciarJuego(nombre);
    }
};

async function iniciarJuego(nombre) {
    player.name = nombre;
    player.color = document.getElementById('skinColor').value;
    document.getElementById('loading-screen').style.display = 'flex';
    
    const pRef = ref(db, 'jugadores/' + player.id);
    onDisconnect(pRef).remove();
    await set(pRef, player);
    
    document.getElementById('ui-layer').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    
    onValue(ref(db, 'jugadores'), (snap) => {
        const ctx = document.getElementById('gameCanvas').getContext('2d');
        ctx.clearRect(0, 0, 800, 500);
        snap.forEach(c => {
            const p = c.val();
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(p.name, p.x, p.y - 30);
        });
    });

    onValue(ref(db, 'mensajes'), (snap) => {
        const chat = document.getElementById('chat-display');
        const isAtBottom = chat.scrollHeight - chat.clientHeight <= chat.scrollTop + 50;
        chat.innerHTML = "";
        snap.forEach(c => { const m = c.val(); chat.innerHTML += `<div><b>${m.nombre}:</b> ${m.texto}</div>`; });
        if (isAtBottom) chat.scrollTop = chat.scrollHeight;
    });
}

window.onkeydown = (e) => {
    if (document.activeElement.id === 'chat-input') return;
    if(e.key.startsWith('Arrow')) {
        if(e.key === 'ArrowUp') player.y -= 10;
        if(e.key === 'ArrowDown') player.y += 10;
        if(e.key === 'ArrowLeft') player.x -= 10;
        if(e.key === 'ArrowRight') player.x += 10;
        update(ref(db, 'jugadores/' + player.id), { x: player.x, y: player.y });
    }
};

document.getElementById('chat-input').onkeypress = (e) => {
    if (e.key === 'Enter') {
        push(ref(db, 'mensajes'), { nombre: player.name, texto: e.target.value });
        e.target.value = "";
    }
};

const volSlider = document.getElementById('vol-slider');
volSlider.oninput = () => {
    document.getElementById('volVal').innerText = volSlider.value + '%';
    localStorage.setItem('geraChatVol', volSlider.value);
};
volSlider.value = localStorage.getItem('geraChatVol') || 50;
document.getElementById('volVal').innerText = volSlider.value + '%';