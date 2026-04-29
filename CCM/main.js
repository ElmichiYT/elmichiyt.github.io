import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onValue, set, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = { 
    apiKey: "AIzaSyCUpLsYkBaAkLSZpDwkx-GnWykZec-Oh-o", 
    authDomain: "classicube-messenger.firebaseapp.com", 
    projectId: "classicube-messenger", 
    databaseURL: "https://classicube-messenger-default-rtdb.firebaseio.com",
    appId: "1:113987340884:web:81d8a03a9ac557f4897bc1" 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const chatRef = ref(db, 'mensajes_cc');

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const input = document.getElementById('mensaje');

// --- MULTIMEDIA URL ---
window.promptMedia = (type) => {
    const url = prompt(`URL del ${type}:`);
    if(!url) return;
    let tag = "";
    if(type === 'video') tag = `@@VIDEO:${url}`;
    else if(type === 'audio') tag = `@@AUDIO:${url}`;
    else if(type === 'image') tag = `![Img](${url})`;
    else tag = `[📁 Archivo](${url})`;
    enviar(tag);
    document.getElementById('fileMenu').classList.remove('show');
};

document.getElementById('btnMenu').onclick = () => document.getElementById('fileMenu').classList.toggle('show');

// --- LÓGICA ENVÍO ---
const enviar = (manualText = null) => {
    const texto = manualText || input.value.trim();
    if(!texto || !auth.currentUser) return;
    push(chatRef, { nombre: auth.currentUser.displayName, uid: auth.currentUser.uid, texto, timestamp: Date.now() });
    if(!manualText) input.value = "";
    remove(ref(db, `typing/${auth.currentUser.uid}`));
};

input.onkeydown = (e) => {
    if(isMobile) return; // Solo botón en móvil
    if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
};

document.getElementById('btnEnviar').onclick = () => enviar();

// --- RENDERIZADO ---
onChildAdded(chatRef, (snap) => {
    const d = snap.val();
    const isOwn = d.uid === auth.currentUser?.uid;
    const div = document.createElement('div');
    div.className = `msg ${isOwn ? 'own' : 'other'}`;
    
    let content = d.texto;
    if(content.startsWith("@@VIDEO:")) content = `<video controls src="${content.split(':')[1]}"></video>`;
    else if(content.startsWith("@@AUDIO:")) content = `<audio controls src="${content.split(':')[1]}"></audio>`;
    else content = marked.parse(d.texto);

    div.innerHTML = `<small style="font-size:0.7em; display:block; opacity:0.8;">${d.nombre}</small>${content}`;
    document.getElementById('chat').appendChild(div);
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
    
    if(document.hidden) document.getElementById('notif-sound').play().catch(()=>{});
});

// --- AUTH / TEMAS ---
onAuthStateChanged(auth, (user) => {
    if(user) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('input-container').classList.remove('hidden');
        onValue(ref(db, `users_config/${user.uid}`), (s) => { if(s.val()) aplicarTema(s.val().theme); });
    }
});

const aplicarTema = (t) => {
    const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.body.classList.toggle('dark', isDark);
};

document.getElementById('theme-selector').onchange = (e) => {
    aplicarTema(e.target.value);
    if(auth.currentUser) set(ref(db, `users_config/${auth.currentUser.uid}`), { theme: e.target.value });
};

document.getElementById('btnEntrar').onclick = () => signInWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('pass').value);
document.getElementById('btnRegistro').onclick = async () => {
    const cred = await createUserWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('pass').value);
    await updateProfile(cred.user, { displayName: document.getElementById('nickname').value });
    await sendEmailVerification(cred.user);
    alert("Verifica tu correo");
};
document.getElementById('btnSalir').onclick = () => signOut(auth).then(() => location.reload());