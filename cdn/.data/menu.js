(function() {
    // 1. LIMPIEZA DE INSTANCIAS ANTERIORES
    var oldMenu = document.getElementById('web-mod-menu');
    if(oldMenu) oldMenu.remove();
    var oldStyle = document.getElementById('executor-theme');
    if(oldStyle) oldStyle.remove();

    // 2. SISTEMA DE ESTILOS AVANZADOS (Soporta redimensionamiento y scroll)
    var styleEl = document.createElement('style');
    styleEl.id = 'executor-theme';
    styleEl.innerHTML = `
        .executor-panel { 
            position: fixed; 
            top: 50px; 
            left: 50px; 
            z-index: 9999999; 
            background: #0d1117; 
            color: #58a6ff; 
            padding: 15px; 
            border-radius: 8px; 
            border: 2px solid #30363d; 
            width: 420px; 
            height: 500px; /* Altura inicial balanceada */
            min-width: 300px;
            min-height: 250px;
            max-height: 90vh; /* Nunca superará el alto de tu pantalla */
            font-family: monospace; 
            box-shadow: 0 12px 40px rgba(0,0,0,0.9); 
            font-size: 12px; 
            display: flex;
            flex-direction: column;
            overflow: hidden; /* Evita que el panel se rompa */
            resize: both; /* ¡PERMITE CAMBIAR EL TAMAÑO ARRASTRANDO LA ESQUINA! */
        }
        .executor-header { margin: 0 0 5px 0; font-size: 13px; color: #f0f6fc; border-bottom: 1px solid #21262d; padding-bottom: 5px; cursor: move; }
        .executor-sub { color: #8b949e; font-size: 9px; margin-bottom: 12px; text-transform: uppercase; }
        
        /* Zona con scroll interno para los exploits */
        .executor-scrollable-content { 
            flex: 1; 
            overflow-y: auto; 
            padding-right: 5px; 
            margin-bottom: 10px;
        }
        
        .module-category { color: #ffa657; font-weight: bold; margin: 12px 0 6px 0; border-bottom: 1px dashed #21262d; padding-bottom: 2px; font-size: 11px; }
        .module-btn { width: 100%; background: #21262d; color: #c9d1d9; border: 1px solid #30363d; padding: 7px; margin-bottom: 5px; cursor: pointer; font-weight: bold; font-family: monospace; text-align: left; border-radius: 4px; font-size: 11px; transition: all 0.2s; }
        .module-btn:hover { background: #30363d; color: #58a6ff; border-color: #58a6ff; }
        
        .executor-footer { border-top: 1px solid #21262d; padding-top: 10px; }
        .executor-btn-danger { width: 100%; background: #da3633; color: #fff; border: none; padding: 7px; font-weight: bold; cursor: pointer; border-radius: 4px; font-family: monospace; }
        .executor-btn-danger:hover { background: #f85149; }
        
        .executor-textarea { width: 95%; height: 50px; background: #010409; color: #7ee787; border: 1px solid #30363d; font-family: monospace; font-size: 11px; padding: 5px; resize: none; border-radius: 4px; margin-bottom: 5px; }
        .executor-input { background: #010409; color: #fff; border: 1px solid #30363d; padding: 5px; font-size: 11px; border-radius: 4px; margin-bottom: 5px; }
        
        /* Estilo de la barra de scroll */
        .executor-scrollable-content::-webkit-scrollbar { width: 6px; }
        .executor-scrollable-content::-webkit-scrollbar-track { background: #0d1117; }
        .executor-scrollable-content::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
    `;
    document.head.appendChild(styleEl);

    // 3. BASE DE DATOS DE EXPLOITS EN ESPAÑOL (Módulos de Utilidad Real)
    var modules = [
        // --- CATEGORÍA: EVASIÓN Y DESBLOQUEOS ---
        {
            id: 'exp_bypass_restricciones',
            category: '🔓 EVASIÓN Y PARCHEO DE SEGURIDAD',
            label: 'Matar Protectores de Pantalla (Click, Copiar, Pegar)',
            desc: 'Fuerza la activación del click derecho y desbloquea la selección de texto o copiado en páginas protegidas.',
            exec: function() {
                var antiBloqueo = function(e){ e.stopImmediatePropagation(); return true; };
                ['contextmenu', 'copy', 'selectstart', 'paste', 'keydown', 'mousedown'].forEach(evt => {
                    document.addEventListener(evt, antiBloqueo, true);
                });
                alert('💥 Bloqueadores del DOM desactivados. Permisos de escritura y copia forzados.');
            }
        },
        {
            id: 'exp_revelar_contrasenas',
            category: '🔓 EVASIÓN Y PARCHEO DE SEGURIDAD',
            label: 'Desenmascarar Campos de Contraseña',
            desc: 'Convierte todos los inputs de tipo password ocultos a texto legible.',
            exec: function() {
                var inputs = document.querySelectorAll('input[type="password"]');
                inputs.forEach(i => i.type = 'text');
                alert('🔑 Revelados ' + inputs.length + ' campos de contraseña en la página.');
            }
        },
        {
            id: 'exp_eliminar_paywalls',
            category: '🔓 EVASIÓN Y PARCHEO DE SEGURIDAD',
            label: 'Forzar Bypass de Modales Oclusivos (Anti-Paywall)',
            desc: 'Busca elementos superpuestos que bloquean la lectura de artículos y los elimina junto con el blur.',
            exec: function() {
                var elementos = document.querySelectorAll('div');
                elementos.forEach(el => {
                    var zIndex = window.getComputedStyle(el).zIndex;
                    if (parseInt(zIndex) > 999 && el.id !== 'web-mod-menu') {
                        el.remove();
                    }
                });
                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
                alert('🛡️ Capas restrictivas eliminadas. Scroll del cuerpo restaurado.');
            }
        },

        // --- CATEGORÍA: INGENIERÍA INVERSA ---
        {
            id: 'exp_espiar_red',
            category: '🕵️ INGENIERÍA INVERSA Y RED',
            label: 'Inyectar Sniffer de Tráfico (XHR / Fetch)',
            desc: 'Captura en tiempo real los endpoints y peticiones internas de la aplicación.',
            exec: function() {
                if(window.__snifferActivo) { alert('El Sniffer ya se encuentra corriendo.'); return; }
                window.__snifferActivo = true;
                var rawFetch = window.fetch;
                window.fetch = function() {
                    console.log('%c[EXPLOIT SNIFFER]: Petición detectada ->', 'color:#ffa657; font-weight:bold;', arguments[0]);
                    return rawFetch.apply(this, arguments);
                };
                alert('🛰️ Sniffer interceptando de manera pasiva. Abre la consola de desarrollo (F12) para ver los endpoints.');
            }
        },
        {
            id: 'exp_clonar_pagina',
            category: '🕵️ INGENIERÍA INVERSA Y RED',
            label: 'Descargar Código Fuente Limpio (DOM Dump)',
            desc: 'Genera un archivo HTML con el estado exacto actual del DOM para análisis offline.',
            exec: function() {
                var blob = new Blob([document.documentElement.outerHTML], {type: "text/html"});
                var a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "dump_auditoria.html";
                a.click();
            }
        },

        // --- CATEGORÍA: MANIPULACIÓN DEL RUNTIME ---
        {
            id: 'exp_congelar_hilos',
            category: '⚡ MANIPULATION DEL RUNTIME',
            label: 'Congelar Bucles de Segundo Plano (Anti-Debuggers)',
            desc: 'Elimina todos los intervalos y timeouts asíncronos para detener anti-cheats o loops infinitos.',
            exec: function() {
                var maxId = window.setTimeout(function(){}, 0);
                while(maxId--) { window.clearTimeout(maxId); window.clearInterval(maxId); }
                alert('⏳ Todos los timers e intervalos asíncronos activos fueron abortados con éxito.');
            }
        },
        {
            id: 'exp_editar_interfaz',
            category: '⚡ MANIPULATION DEL RUNTIME',
            label: 'Activar Modo Editor de Texto Global (DesignMode)',
            desc: 'Te permite hacer clic y editar directamente cualquier texto visible en la página como si fuera Word.',
            exec: function() {
                if(document.designMode === 'on') {
                    document.designMode = 'off';
                    alert('📝 Modo de edición desactivado.');
                } else {
                    document.designMode = 'on';
                    alert('📝 Modo de edición ACTIVADO. Haz clic en cualquier texto de la web y modifícalo.');
                }
            }
        }
    ];

    // 4. CREACIÓN DE LA ESTRUCTURA DEL PANEL MODULAR
    var panel = document.createElement('div');
    panel.id = 'web-mod-menu';
    panel.className = 'executor-panel';

    // Algoritmo de arrastre (Drag & Drop)
    var isDragging = false, offsetX, offsetY;
    panel.addEventListener('mousedown', function(e) {
        if(e.target.closest('input') || e.target.closest('button') || e.target.closest('textarea') || e.offsetX > panel.clientWidth - 15 || e.offsetY > panel.clientHeight - 15) return;
        isDragging = true; offsetX = e.clientX - panel.offsetLeft; offsetY = e.clientY - panel.offsetTop;
    });
    document.addEventListener('mousemove', function(e) { if(isDragging) { panel.style.left = (e.clientX - offsetX) + 'px'; panel.style.top = (e.clientY - offsetY) + 'px'; } });
    document.addEventListener('mouseup', function() { isDragging = false; });

    // Cabecera e Instrucciones
    var html = '<div class="executor-header">👑 EXECUTOR DEFINITIVO v5.0</div>';
    html += '<div class="executor-sub">Modo: Suite de Auditoría Avanzada // Resizable</div>';
    
    // Contenedor dinámico con scrollbar
    html += '<div class="executor-scrollable-content" id="executor-scroll-box"></div>';

    // Módulo de Inyección de Scripts Crudos (Al estilo Delta Executor)
    html += '<div style="border-top:1px solid #21262d; padding-top:5px;">';
    html += '<div class="module-category">INYECTOR DE INSTRUCCIONES (PAYLOAD)</div>';
    html += '<textarea id="payload-sandbox" class="executor-textarea" placeholder="// Pega tu script personalizado aquí..."></textarea>';
    html += '<button id="btn-compilar" class="module-btn" style="background:#238636; color:#fff; text-align:center; border-color:#2ea44f;">▶️ INYECTAR CÓDIGO</button>';
    html += '</div>';

    // Sección de Destrucción del Menú
    html += '<div class="executor-footer"><button id="btn-destroy-suite" class="executor-btn-danger">🚪 DESACOPLAR EXECUTOR</button></div>';
    
    panel.innerHTML = html;
    document.body.appendChild(panel);

    // 5. CONSTRUCCIÓN AUTOMÁTICA DE BOTONES BASADA EN CATEGORÍAS
    var scrollBox = document.getElementById('executor-scroll-box');
    var ultimaCategoria = '';

    modules.forEach(function(mod) {
        if(mod.category !== ultimaCategoria) {
            ultimaCategoria = mod.category;
            var catTitle = document.createElement('div');
            catTitle.className = 'module-category';
            catTitle.innerText = ultimaCategoria;
            scrollBox.appendChild(catTitle);
        }
        var btn = document.createElement('button');
        btn.className = 'module-btn';
        btn.id = mod.id;
        btn.innerText = mod.label;
        btn.title = mod.desc; // Muestra la descripción si dejas el mouse encima
        btn.onclick = mod.exec;
        scrollBox.appendChild(btn);
    });

    // 6. LÓGICA INTERNA DE COMPILACIÓN Y DESTRUCCIÓN
    document.getElementById('btn-compilar').onclick = function() {
        var scriptCrudo = document.getElementById('payload-sandbox').value;
        if(!scriptCrudo.trim()) return;
        try {
            var salida = window.eval(scriptCrudo);
            console.log('[CONSOLA EXECUTOR]: Ejecución exitosa ->', salida);
        } catch(err) {
            alert('⚠️ Error de sintaxis en tu Payload:\n' + err.message);
        }
    };

    document.getElementById('btn-destroy-suite').onclick = function() { 
        panel.remove(); 
        styleEl.remove(); 
    };
})();