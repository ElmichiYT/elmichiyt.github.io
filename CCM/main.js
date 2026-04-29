import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onValue, set, update, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_DOMINIO.firebaseapp.com",
    projectId: "TU_PROYECTO",
    databaseURL: "https://TU_BASE.firebaseio.com",
    storageBucket: "TU_STORAGE.appspot.com",
    messagingSenderId: "ID",
    appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Variables de estado
let unreadCount = 0;
let firstUnreadMsg = null;
let replyData = null;
const tituloOriginal = "ClassiCube Messenger";
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// --- UTILIDADES ---
const sanitize = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML; // Esto escapa HTML malicioso
};

// --- MANEJO DE NOTIFICACIONES ---
if (Notification.permission !== 'granted') Notification.requestPermission();

const mostrarNotificacion = (nombre, texto) => {
    if (document.hidden && Notification.permission === 'granted') {
        unreadCount++;
        document.title = `(${unreadCount}) ${tituloOriginal}`;
        document.getElementById('notif-sound').play().catch(()=>{});
        
        new Notification(`Tienes ${unreadCount} mensajes sin leer en ClassiCube Messenger`, {
            body: `${nombre}: ${texto.substring(0, 50)}`,
            icon: 'favicon.ico'
        });
    }
};

// --- VISIBILIDAD DE PESTAÑA ---
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        if (firstUnreadMsg) {
            firstUnreadMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        unreadCount = 0;
        firstUnreadMsg = null;
        document.title = tituloOriginal;
    }
});

// --- LÓGICA DE TEMAS ---
const aplicarTema = (t) => {
    const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.body.classList.toggle('dark', isDark);
};

document.getElementById('theme-selector').onchange = (e) => {
    const tema = e.target.value;
    aplicarTema(tema);
    if (auth.currentUser) set(ref(db, `users_config/${auth.currentUser.uid}`), { theme: tema });
};

// --- FUNCIONES DE CHAT ---
const enviarMensaje = () => {
    const input = document.getElementById('mensaje');
    const texto = input.value.trim();
    if (!texto || !auth.currentUser) return;

    push(ref(db, 'mensajes_cc'), {
        uid: auth.currentUser.uid,
        nombre: auth.currentUser.displayName,
        texto: sanitize(texto),
        timestamp: Date.now(),
        replyTo: replyData ? replyData.nombre : null
    });

    input.value = "";
    input.style.height = 'auto';
    cancelarRespuesta();
    remove(ref(db, `typing/${auth.currentUser.uid}`));
};

const cancelarRespuesta = () => {
    replyData = null;
    document.getElementById('replying-to').classList.add('hidden');
};

// Bloqueo de Enter en móvil / Shift+Enter en PC
document.getElementById('mensaje').onkeydown = (e) => {
    if (isMobile) return; // En móvil no hace nada el Enter del teclado físico
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensaje();
    }
};

document.getElementById('mensaje').oninput = (e) => {
    if (auth.currentUser) {
        set(ref(db, `typing/${auth.currentUser.uid}`), auth.currentUser.displayName);
        // Auto-expandir textarea
        e.target.style.height = 'auto';
        e.target.style.height = (e.target.scrollHeight) + 'px';
    }
};

// --- RENDERIZADO ---
onChildAdded(ref(db, 'mensajes_cc'), (snap) => {
    const d = snap.val();
    const id = snap.key;
    const isOwn = d.uid === auth.currentUser?.uid;

    const div = document.createElement('div');
    div.className = 'msg';
    div.id = `msg-${id}`;
    
    div.innerHTML = `
        ${d.replyTo ? `<small>En respuesta a: <b>${d.replyTo}</b></small><br>` : ''}
        <b>${d.nombre}</b> <small>${new Date(d.timestamp).toLocaleTimeString()}</small>
        <div class="content">${marked.parse(d.texto)}</div>
        <div class="msg-actions">
            <button onclick="window.setReply('${id}', '${d.nombre}')">Responder</button>
            ${isOwn ? `
                <button onclick="window.editMsg('${id}', '${sanitize(d.texto)}')">Editar</button>
                <button onclick="window.delMsg('${id}')">Borrar</button>
            ` : ''}
        </div>
    `;

    // Fallback para imágenes rotas
    div.querySelectorAll('img').forEach(img => {
        img.onerror = () => img.src = 'no-disponible.png';
    });

    document.getElementById('chat').appendChild(div);

    if (document.hidden) {
        if (!firstUnreadMsg) firstUnreadMsg = div;
        mostrarNotificacion(d.nombre, d.texto);
    } else {
        const chat = document.getElementById('chat');
        if (chat.scrollHeight - chat.scrollTop - chat.clientHeight < 200) {
            chat.scrollTop = chat.scrollHeight;
        } else {
            document.getElementById('new-messages-toast').classList.remove('hidden');
        }
    }
});

// Funciones globales para botones dinámicos
window.setReply = (id, nombre) => {
    replyData = { id, nombre };
    document.getElementById('reply-text').textContent = `Respondiendo a ${nombre}`;
    document.getElementById('replying-to').classList.remove('hidden');
};

window.delMsg = (id) => { if(confirm("¿Borrar mensaje?")) remove(ref(db, `mensajes_cc/${id}`)); };

window.editMsg = (id, oldText) => {
    const nuevo = prompt("Edita tu mensaje:", oldText);
    if(nuevo) update(ref(db, `mensajes_cc/${id}`), { texto: sanitize(nuevo), editado: true });
};

// --- ESCRIBIENDO ---
onValue(ref(db, 'typing'), (snap) => {
    const list = snap.val() || {};
    const users = Object.entries(list)
        .filter(([uid]) => uid !== auth.currentUser?.uid)
        .map(([_, name]) => name);
    document.getElementById('typing-area').textContent = 
        users.length > 0 ? `${users.join(', ')} está escribiendo...` : '';
});

// --- AUTH ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('input-area').classList.remove('hidden');
        onValue(ref(db, `users_config/${user.uid}`), (s) => {
            if (s.exists()) {
                const t = s.val().theme;
                document.getElementById('theme-selector').value = t;
                aplicarTema(t);
            }
        });
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
    }
});

document.getElementById('btnEntrar').onclick = () => {
    signInWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('pass').value)
        .catch(e => alert("Error: " + e.message));
};

document.getElementById('btnRegistro').onclick = async () => {
    try {
        const cred = await createUserWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('pass').value);
        await updateProfile(cred.user, { displayName: document.getElementById('nickname').value });
        await sendEmailVerification(cred.user);
        alert("¡Cuenta creada! Revisa tu correo para verificarla.");
    } catch (e) { alert(e.message); }
};

document.getElementById('btnSalir').onclick = () => signOut(auth).then(() => location.reload());
document.getElementById('btnEnviar').onclick = enviarMensaje;
document.getElementById('cancel-reply').onclick = cancelarRespuesta;
document.getElementById('btnScroll').onclick = () => {
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight;
    document.getElementById('new-messages-toast').classList.add('hidden');
};