import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = { apiKey: "AIzaSyCUpLsYkBaAkLSZpDwkx-GnWykZec-Oh-o", authDomain: "classicube-messenger.firebaseapp.com", projectId: "classicube-messenger", databaseURL: "https://classicube-messenger-default-rtdb.firebaseio.com/", messagingSenderId: "113987340884", appId: "1:113987340884:web:81d8a03a9ac557f4897bc1" };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const input = document.getElementById('mensaje');
let unreadCount = 0;

// Lógica de Envío (Bloqueo en móvil, Shift+Enter en PC)
const enviar = () => {
    if(!input.value.trim()) return;
    push(ref(db, 'mensajes_cc'), { nombre: auth.currentUser.displayName, texto: input.value.replace(/\n/g, '  \n'), timestamp: Date.now() });
    input.value = "";
};

input.onkeydown = (e) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return; // Obliga al botón en móvil
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
};

document.getElementById('btnEnviar').onclick = enviar;

// Renderizado + Notificaciones
onChildAdded(ref(db, 'mensajes_cc'), (snap) => {
    const d = snap.val();
    const div = document.createElement('div');
    div.className = 'msg';
    div.innerHTML = `<b>${d.nombre}</b> <p>${marked.parse(d.texto)}</p>`;
    div.querySelectorAll('img').forEach(img => img.onerror = () => img.src = 'no-disponible.png');
    document.getElementById('chat').appendChild(div);
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;

    if (document.hidden) {
        unreadCount++;
        document.title = `(${unreadCount}) ClassiCube Messenger`;
        if (Notification.permission === 'granted') new Notification(`Nuevo mensaje`, { body: `${d.nombre}: ${d.texto}` });
    }
});

// Temas y Auth
onAuthStateChanged(auth, (user) => {
    if(user) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('input-area').classList.remove('hidden');
        onValue(ref(db, 'users_config/' + user.uid), (s) => { if(s.val()) aplicarTema(s.val().theme); });
    }
});

const aplicarTema = (t) => {
    if (t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
};

document.getElementById('theme-selector').onchange = (e) => {
    aplicarTema(e.target.value);
    if(auth.currentUser) set(ref(db, 'users_config/' + auth.currentUser.uid), { theme: e.target.value });
};

document.getElementById('btnRegistro').onclick = async () => {
    const cred = await createUserWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('pass').value);
    await updateProfile(cred.user, { displayName: document.getElementById('nickname').value });
    await sendEmailVerification(cred.user);
    alert("Revisa tu correo para activar.");
};

document.getElementById('btnEntrar').onclick = () => signInWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('pass').value);
document.getElementById('btnSalir').onclick = () => signOut(auth).then(() => location.reload());
Notification.requestPermission();