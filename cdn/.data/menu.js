(function() {
    var oldMenu = document.getElementById('web-mod-menu');
    if(oldMenu) oldMenu.remove();

    // 1. Contenedor con estética Cyber/ModMenu
    var menu = document.createElement('div');
    menu.id = 'web-mod-menu';
    menu.style = 'position:fixed;top:40px;left:40px;z-index:9999999;background:rgba(10,10,14,0.95);color:#00ffcc;padding:15px;border-radius:10px;border:2px solid #00ffcc;width:340px;font-family:"Courier New",monospace;box-shadow:0 0 20px #00ffcc;font-size:11px;user-select:none;backdrop-filter:blur(5px);';
    
    // Arrastrar el menú
    var isDragging = false; var offsetX, offsetY;
    menu.addEventListener('mousedown', function(e) {
        if(e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
        isDragging = true; offsetX = e.clientX - menu.offsetLeft; offsetY = e.clientY - menu.offsetTop;
    });
    document.addEventListener('mousemove', function(e) { if(isDragging) { menu.style.left = (e.clientX - offsetX) + 'px'; menu.style.top = (e.clientY - offsetY) + 'px'; } });
    document.addEventListener('mouseup', function() { isDragging = false; });

    // Estilos de los botones del menú
    var btnStyle = 'width:100%;background:#141419;color:#00ffcc;border:1px solid #00ffcc;padding:6px;margin-bottom:6px;cursor:pointer;font-weight:bold;font-family:monospace;text-align:left;border-radius:4px;transition:0.2s;';
    var sectionStyle = 'border-top:1px dashed #00ffcc;margin-top:10px;padding-top:8px;';

    // 2. Interfaz Gráfica (HTML)
    var html = '<h2 style="margin:0 0 5px 0;font-size:14px;text-align:center;color:#fff;text-shadow:0 0 8px #00ffcc;">☣️ WEB MATRIX BYPASS v2.0 ☣️</h2>';
    html += '<div style="color:#66ff66;font-size:9px;text-align:center;margin-bottom:12px;">STATUS: INJECTED // BYPASS ACTIVE</div>';
    
    // CATEGORÍA: FÍSICAS Y MOVIMIENTO
    html += '<b style="color:#ff0055;">[ ESP / PHYSICAL MODS ]</b><br/>';
    html += '<button id="mod-noclip" style="'+btnStyle+'">🟢 [TOGGLE] NoClip (Mover elementos gratis)</button>';
    html += '<button id="mod-gravity" style="'+btnStyle+'">🔴 [FUN] Gravedad Cero (Chaos Mode)</button>';
    html += '<button id="mod-speed" style="'+btnStyle+'">⚡ [BOOST] Forzar Super Velocidad en Videos</button>';

    // CATEGORÍA: EVASIÓN Y RECONOCIMIENTO
    html += '<div style="'+sectionStyle+'">';
    html += '<b style="color:#ffcc00;">[ BYPASS & BYPASS ]</b><br/>';
    html += '<button id="mod-ghost" style="'+btnStyle+'">👻 [GHOST] Invisibilidad AdBlock / Anti-Copiar</button>';
    html += '<button id="mod-unhide" style="'+btnStyle+'">👁️ [X-RAY] Revelar Inputs Ocultos (Hidden)</button>';
    html += '</div>';

    // CATEGORÍA: MEMORY HACKS (LOCALSTORAGE)
    html += '<div style="'+sectionStyle+'">';
    html += '<b style="color:#00ffcc;">[ MEMORY EDIT (LocalStorage) ]</b><br/>';
    html += '<input id="mod-key" placeholder="Variable" style="background:#000;color:#00ffcc;border:1px solid #00ffcc;padding:4px;width:32%;font-size:10px;"/> ';
    html += '<input id="mod-val" placeholder="Valor" style="background:#000;color:#00ffcc;border:1px solid #00ffcc;padding:4px;width:32%;font-size:10px;"/> ';
    html += '<button id="mod-save" style="background:#00ffcc;color:#000;border:none;padding:4px 10px;cursor:pointer;font-weight:bold;font-size:10px;">WRITE</button>';
    html += '</div>';

    // BOTÓN DE EMERGENCIA
    html += '<button id="mod-selfdestruct" style="width:100%;background:#ff0055;color:#fff;border:none;padding:8px;margin-top:15px;cursor:pointer;font-weight:bold;font-family:monospace;border-radius:4px;box-shadow:0 0 10px #ff0055;">⚠️ SELF DESTRUCT (Cerrar)</button>';

    menu.innerHTML = html;
    document.body.appendChild(menu);

    // --- LÓGICA DE LOS HACKS TREMENDOS ---

    // 1. NOCLIP: Te permite arrastrar y mover CUALQUIER caja, imagen, texto o botón de la web a donde te dé la gana, rompiendo la estructura.
    var noclipActive = false;
    document.getElementById('mod-noclip').onclick = function() {
        noclipActive = !noclipActive;
        this.style.background = noclipActive ? '#ff0055' : '#141419';
        this.style.color = noclipActive ? '#fff' : '#00ffcc';
        this.innerText = noclipActive ? '🔴 [ACTIVE] NoClip (Arrastra la web)' : '🟢 [TOGGLE] NoClip (Mover elementos gratis)';
        
        var allElems = document.querySelectorAll('body *');
        allElems.forEach(function(el) {
            if(el.id === 'web-mod-menu' || el.closest('#web-mod-menu')) return;
            if(noclipActive) {
                el.style.position = 'relative';
                el.draggable = true;
                el.addEventListener('dragstart', function(e) { window._draggedEl = e.target; });
            } else {
                el.draggable = false;
            }
        });
    };
    document.addEventListener('dragover', function(e) { e.preventDefault(); });
    document.addEventListener('drop', function(e) {
        if(noclipActive && window._draggedEl) {
            e.preventDefault();
            window._draggedEl.style.left = (e.clientX - window._draggedEl.offsetWidth/2) + 'px';
            window._draggedEl.style.top = (e.clientY - window._draggedEl.offsetHeight/2) + 'px';
            window._draggedEl.style.position = 'absolute';
        }
    });

    // 2. GRAVEDAD CERO: Rompe el CSS por completo de golpe. Todos los elementos de la web empiezan a flotar y a girar de forma aleatoria como si estuvieran en el espacio.
    var gravityActive = false;
    document.getElementById('mod-gravity').onclick = function() {
        gravityActive = !gravityActive;
        this.style.background = gravityActive ? '#ff0055' : '#141419';
        this.style.color = gravityActive ? '#fff' : '#00ffcc';
        this.innerText = gravityActive ? '🟢 [ACTIVE] Gravedad Cero' : '🔴 [FUN] Gravedad Cero (Chaos Mode)';
        
        var tags = document.querySelectorAll('p, img, h1, h2, h3, button, a, div');
        tags.forEach(function(el) {
            if(el.id === 'web-mod-menu' || el.closest('#web-mod-menu')) return;
            if(gravityActive) {
                var rot = Math.floor(Math.random() * 40) - 20;
                var trans = Math.floor(Math.random() * 50) - 25;
                el.style.transition = 'all 2s ease-in-out';
                el.style.transform = 'translateY('+trans+'px) rotate('+rot+'deg)';
            } else {
                el.style.transform = 'none';
            }
        });
    };

    // 3. VELOCIDAD SUPERSÓNICA: Salta restricciones y pone cualquier video de la web a 16x (dieciséis veces más rápido). El límite normal suele ser 2x.
    document.getElementById('mod-speed').onclick = function() {
        var vids = document.querySelectorAll('video');
        if(vids.length > 0) {
            vids.forEach(v => v.playbackRate = 16.0);
            alert('¡HACK APICADO! ' + vids.length + ' video(s) corriendo a 16x de velocidad.');
        } else {
            alert('Error: No se detectaron reproductores de video en esta zona.');
        }
    };

    // 4. GHOST MODE: Rompe las alertas del AdBlock, reactiva el click derecho, quita bloqueos de copia de texto y borra scripts rastreadores que congelan la web de golpe.
    document.getElementById('mod-ghost').onclick = function() {
        var stopProp = function(e){ e.stopImmediatePropagation(); return true; };
        ['contextmenu', 'copy', 'selectstart', 'keydown'].forEach(evt => {
            document.addEventListener(evt, stopProp, true);
        });
        document.querySelectorAll('*').forEach(el => {
            if(el.style.position === 'fixed' && el.style.zIndex > 1000 && el.id !== 'web-mod-menu') el.remove();
        });
        document.body.style.overflow = 'auto';
        alert('Modo Ghost Activado: Restricciones de copiado y overlays invasivos destruidos.');
    };

    // 5. X-RAY INPUTS: Fuerza a la web a mostrar campos ocultos (`<input type="hidden">`) que los desarrolladores usan para guardar tokens de backend, IDs de usuario o variables ocultas del sistema.
    document.getElementById('mod-unhide').onclick = function() {
        var hiddens = document.querySelectorAll('input[type="hidden"]');
        hiddens.forEach(el => {
            el.type = 'text';
            el.style.background = '#330033';
            el.style.color = '#ff00ff';
            el.style.border = '2px dashed #ff00ff';
            el.value = el.value || '[Vacío]';
        });
        alert('Escaneo X-Ray completado. Se forzó la aparición de ' + hiddens.length + ' campos ocultos del sistema.');
    };

    // 6. EDITOR MEMORIA (WRITE CODES)
    document.getElementById('mod-save').onclick = function() {
        var k = document.getElementById('mod-key').value.trim();
        var v = document.getElementById('mod-val').value.trim();
        if(k) {
            localStorage.setItem(k, v);
            alert('Escritura exitosa en sector memoria:\n' + k + ' ➡️ ' + v);
        }
    };

    // AUTO DESTRUCCIÓN
    document.getElementById('mod-selfdestruct').onclick = function() { menu.remove(); };
})();