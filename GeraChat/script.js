import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getDatabase, ref, set, onValue, push, onDisconnect, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

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

// Variables globales mínimas
let player = { id: Date.now(), x: 400, y: 250, color: '#3498db', name: "Invitado" };

// Exponer funciones al window para el HTML
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
    
    // Iniciar listeners
    onValue(ref(db, 'jugadores'), (snap) => {
        const ctx = document.getElementById('gameCanvas').getContext('2d');
        ctx.clearRect(0, 0, 800, 500);
        snap.forEach(c => {
            const p = c.val();
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillText(p.name, p.x, p.y - 30);
        });
    });
}