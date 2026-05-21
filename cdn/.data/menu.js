(function() {
    // 1. CONTROL DE DUPLICADOS
    var oldMenu = document.getElementById('web-mod-menu');
    if(oldMenu) oldMenu.remove();

    // 2. INYECCIÓN DE ESTILOS GLOBALES DE LA INTERFAZ
    var styleEl = document.createElement('style');
    styleEl.innerHTML = `
        .executor-panel { position:fixed; top:30px; left:30px; z-index:9999999; background:#0d1117; color:#58a6ff; padding:15px; border-radius:8px; border:1px solid #30363d; width:450px; font-family:monospace; box-shadow:0 12px 40px rgba(0,0,0,0.8); font-size:12px; user-select:none; }
        .executor-header { margin:0 0 5px 0; font-size:13px; color:#f0f6fc; border-bottom:1px solid #21262d; padding-bottom:5px; text-align:center; }
        .executor-sub { color:#8b949e; font-size:9px; text-align:center; margin-bottom:12px; }
        .executor-body { max-height:450px; overflow-y:auto; padding-right:5px; }
        .module-category { color:#ffa657; font-weight:bold; margin:10px 0 5px 0; border-bottom:1px dashed #21262d; padding-bottom:2px; font-size:11px; }
        .module-btn { width:100%; background:#21262d; color:#c9d1d9; border:1px solid #30363d; padding:6px; margin-bottom:5px; cursor:pointer; font-weight:bold; font-family:monospace; text-align:left; border-radius:4px; font-size:11px; }
        .module-btn:hover { background:#30363d; color:#58a6ff; border-color:#58a6ff; }
        .module-btn.active { background:#1f6feb; color:#fff; border-color:#58a6ff; }
        .executor-footer { margin-top:12px; border-top:1px solid #21262d; padding-top:10px; }
        .executor-btn-danger { width:100%; background:#da3633; color:#fff; border:none; padding:7px; font-weight:bold; cursor:pointer; border-radius:4px; font-family:monospace; }
        .executor-btn-danger:hover { background:#f85149; }
        .executor-textarea { width:97%; height:60px; background:#010409; color:#7ee787; border:1px solid #30363d; font-family:monospace; font-size:11px; padding:5px; resize:none; border-radius:4px; margin-bottom:5px; }
        .executor-input { background:#010409; color:#fff; border:1px solid #30363d; padding:4px; font-size:11px; border-radius:4px; margin-bottom:5px; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#0d1117; }
        ::-webkit-scrollbar-thumb { background:#30363d; border-radius:3px; }
    `;
    document.head.appendChild(styleEl);

    // 3. BASE DE DATOS DE MÓDULOS (PAYLOAD MATRIX)
    var modules = [
        // --- CATEGORÍA: TRÁFICO Y RED ---
        {
            id: 'net_hook_fetch',
            category: 'NETWORK & TRAFFIC INTERCEPTION',
            label: '🛰️ Hook Fetch/XHR Pipeline (Sniffer)',
            desc: 'Intercepta peticiones salientes HTTP asíncronas para extraer endpoints.',
            exec: function() {
                if(window.__fetchHooked) { alert('Módulo ya activo.'); return; }
                window.__fetchHooked = true;
                var origFetch = window.fetch;
                window.fetch = function() {
                    console.log('%c[FETCH CAPTURED]:', 'color:#7ee787; font-weight:bold;', arguments[0]);
                    return origFetch.apply(this, arguments);
                };
                alert('Hook inyectado. Monitorea las llamadas de red en la consola de desarrollo (F12).');
            }
        },
        {
            id: 'net_scan_headers',
            category: 'NETWORK & TRAFFIC INTERCEPTION',
            label: '🔍 Security Headers Scan (CSP/CORS)',
            desc: 'Analiza la configuración de las cabeceras HTTP del servidor remoto.',
            exec: function() {
                fetch('https://httpview-api.vercel.app/api/view?url='+encodeURIComponent(window.location.href))
                .then(r=>r.json()).then(data=>{
                    var h = data.headers || {};
                    alert('INFRAESTRUCTURA:\nServer: '+(h['server']||'Oculto')+'\nCSP: '+(h['content-security-policy']?'Configurado':'Faltante (Riesgo XSS)'));
                }).catch(()=>{ alert('Incapaz de mapear cabeceras en este entorno.'); });
            }
        },
        {
            id: 'net_dump_cookies',
            category: 'NETWORK & TRAFFIC INTERCEPTION',
            label: '🍪 Dump Session Cookie Tokens',
            desc: 'Extrae y lista los identificadores de cookies accesibles desde el contexto actual.',
            exec: function() {
                var c = document.cookie;
                if(!c) { alert('No se encontraron cookies accesibles en el scope de JavaScript.'); return; }
                var w = window.open();
                w.document.write('<h3>Session Cookies Dump:</h3><pre>'+c.split(';').join('\n')+'</pre>');
                w.document.close();
            }
        },

        // --- CATEGORÍA: INGENIERÍA INVERSA DEL DOM ---
        {
            id: 'dom_bypass_restrictions',
            category: 'DOM REVERSE ENGINEERING & BYPASS',
            label: '🔓 Abort Client-Side DOM Lockers',
            desc: 'Neutraliza listeners que restringen clic derecho, selección o copiado.',
            exec: function() {
                var kill = function(e){ e.stopImmediatePropagation(); return true; };
                ['contextmenu', 'copy', 'selectstart', 'paste', 'keydown'].forEach(evt => {
                    document.addEventListener(evt, kill, true);
                });
                alert('Bypass inyectado de forma global en el árbol del DOM.');
            }
        },
        {
            id: 'dom_reveal_hidden',
            category: 'DOM REVERSE ENGINEERING & BYPASS',
            label: '👁️ Force-Expose Hidden Inputs',
            desc: 'Modifica elementos input ocultos para inspeccionar sus parámetros internos.',
            exec: function() {
                var items = document.querySelectorAll('input[type="hidden"]');
                items.forEach(el => {
                    el.type = 'text'; el.style.border = '2px dashed #ff7b72'; el.style.background = '#210000';
                });
                alert('Descubiertos e inspeccionados ' + items.length + ' nodos ocultos.');
            }
        },
        {
            id: 'dom_unmask_passwords',
            category: 'DOM REVERSE ENGINEERING & BYPASS',
            label: '🔑 Unmask Password Input Fields',
            desc: 'Convierte máscaras de contraseñas de tipo password a tipo texto plano.',
            exec: function() {
                var fields = document.querySelectorAll('input[type="password"]');
                fields.forEach(f => f.type = 'text');
                alert('Desenmascarados ' + fields.length + ' campos de entrada de credenciales.');
            }
        },
        {
            id: 'dom_break_iframes',
            category: 'DOM REVERSE ENGINEERING & BYPASS',
            label: '🖼️ Framebusting / Break Isolated Iframes',
            desc: 'Extrae las URLs de marcos embebidos aislados para su inspección individual.',
            exec: function() {
                var frames = document.querySelectorAll('iframe');
                if(frames.length === 0) { alert('No se encontraron estructuras iframe.'); return; }
                var list = []; frames.forEach(f => { if(f.src) list.push(f.src); });
                alert('Detectados ' + frames.length + ' iframes. URLs:\n\n' + list.join('\n'));
            }
        },

        // --- CATEGORÍA: RUNTIME Y DEPURACIÓN ---
        {
            id: 'run_freeze_intervals',
            category: 'RUNTIME MANIPULATION & DEBUGGING',
            label: '⏳ Abort Async Loops & Intervals',
            desc: 'Limpia el registro de hilos asíncronos en ejecución (timeouts activos).',
            exec: function() {
                var id = window.setTimeout(function(){}, 0);
                while(id--) { window.clearTimeout(id); window.clearInterval(id); }
                alert('Sistemas de temporización y pooling cancelados de manera abrupta.');
            }
        },
        {
            id: 'run_perf_audit',
            category: 'RUNTIME MANIPULATION & DEBUGGING',
            label: '⚡ Performance Profiler Check',
            desc: 'Analiza métricas de carga del motor del navegador y consumo de recursos.',
            exec: function() {
                var mem = performance.memory ? (performance.memory.usedJSHeapSize / (1024*1024)).toFixed(2) + ' MB' : 'No disponible';
                alert('MÉTRICAS DE RENDIMIENTO:\n\nTiempo de navegación: ' + (performance.now()/1000).toFixed(2) + 's\nUso de memoria Heap: ' + mem);
            }
        },

        // --- CATEGORÍA: ANÁLISIS DE RECURSOS ---
        {
            id: 'res_dump_scripts',
            category: 'RESOURCE AUDITING & FUZZING',
            label: '📂 Map External JavaScript Assets',
            desc: 'Compila un mapa de todos los dominios que están inyectando scripts.',
            exec: function() {
                var scripts = document.querySelectorAll('script[src]');
                var urls = Array.from(scripts).map(s => s.src);
                if(urls.length === 0) { alert('No hay dependencias de scripts externos.'); return; }
                var w = window.open(); w.document.write('<h3>Scripts Externos Cargados:</h3><pre>' + urls.join('\n') + '</pre>'); w.document.close();
            }
        },
        {
            id: 'res_fuzz_images',
            category: 'RESOURCE AUDITING & FUZZING',
            label: '🎨 Image Component Scraper Matrix',
            desc: 'Agrupa y extrae todos los componentes gráficos cargados en la sesión.',
            exec: function() {
                var imgs = document.querySelectorAll('img');
                if(imgs.length === 0) { alert('No hay recursos gráficos disponibles.'); return; }
                var w = window.open();
                w.document.write('<html><body style="background:#000;color:#fff;font-family:monospace;"><h3>Assets Gráficos:</h3><div style="display:flex;flex-wrap:wrap;gap:10px;">');
                imgs.forEach(i => { if(i.src) w.document.write('<div style="background:#222;padding:5px;"><img src="'+i.src+'" style="max-height:100px;display:block;"/><input value="'+i.src+'" style="width:100px;" readonly/></div>'); });
                w.document.write('</div></body></html>'); w.document.close();
            }
        }
    ];

    // 4. CREACIÓN DINÁMICA DE LA INTERFAZ DE USUARIO (GUI)
    var panel = document.createElement('div');
    panel.id = 'web-mod-menu';
    panel.className = 'executor-panel';

    // Sistema Drag & Drop
    var isDragging = false, offsetX, offsetY;
    panel.addEventListener('mousedown', function(e) {
        if(e.target.closest('input') || e.target.closest('button') || e.target.closest('textarea')) return;
        isDragging = true; offsetX = e.clientX - panel.offsetLeft; offsetY = e.clientY - panel.offsetTop;
    });
    document.addEventListener('mousemove', function(e) { if(isDragging) { panel.style.left = (e.clientX - offsetX) + 'px'; panel.style.top = (e.clientY - offsetY) + 'px'; } });
    document.addEventListener('mouseup', function() { isDragging = false; });

    // Header del panel
    var html = '<div class="executor-header">⚡ ADVANCED EXECUTOR MATRIX v4.0</div>';
    html += '<div class="executor-sub">ENVIRONMENT: PRODUCTION AUDIT SUITE // STABLE</div>';
    html += '<div class="executor-body" id="executor-modules-container"></div>';

    // Sección de Consola de Ejecución Directa (Custom Scripts)
    html += '<div style="border-top:1px solid #21262d; margin-top:10px; padding-top:10px;">';
    html += '<div class="module-category">CORE INJECTOR PIPELINE</div>';
    html += '<textarea id="custom-payload-area" class="executor-textarea" placeholder="// Inserta bloque de código JavaScript plano a evaluar..."></textarea>';
    html += '<button id="btn-run-payload" class="module-btn" style="background:#238636; color:#fff; text-align:center; border-color:#2ea44f;">▶️ COMPILAR & EJECUTAR PAYLOAD</button>';
    html += '</div>';

    // Sección de Manipulación de Caché (LocalStorage)
    html += '<div style="border-top:1px solid #21262d; margin-top:5px; padding-top:5px;">';
    html += '<div class="module-category">LOCAL MEMORY REGISTRY (TAMPERING)</div>';
    html += '<input id="tamper-key" class="executor-input" placeholder="Key" style="width:30%;"/> ';
    html += '<input id="tamper-val" class="executor-input" placeholder="Value" style="width:40%;"/> ';
    html += '<button id="btn-tamper-write" class="module-btn" style="width:20%; display:inline-block; padding:4px; text-align:center; background:#1f6feb; color:#fff;">WRITE</button>';
    html += '</div>';

    // Footer / Botón de Cierre
    html += '<div class="executor-footer"><button id="btn-detach-suite" class="executor-btn-danger">🚪 DETACH AUDIT ENGINE</button></div>';
    
    panel.innerHTML = html;
    document.body.appendChild(panel);

    // 5. RENDERIZADO AUTOMÁTICO DE LOS MÓDULOS REGISTRADOS
    var container = document.getElementById('executor-modules-container');
    var currentCat = '';
    
    modules.forEach(function(mod) {
        if(mod.category !== currentCat) {
            currentCat = mod.category;
            var catHeader = document.createElement('div');
            catHeader.className = 'module-category';
            catHeader.innerText = currentCat;
            container.appendChild(catHeader);
        }
        var btn = document.createElement('button');
        btn.className = 'module-btn';
        btn.id = mod.id;
        btn.innerText = mod.label;
        btn.title = mod.desc;
        btn.onclick = mod.exec;
        container.appendChild(btn);
    });

    // 6. LÓGICA DE LOS ENGINES COMPLEMENTARIOS
    document.getElementById('btn-run-payload').onclick = function() {
        var code = document.getElementById('custom-payload-area').value;
        if(!code.trim()) return;
        try {
            var result = window.eval(code);
            console.log('[EVAL RESULT]:', result);
        } catch(err) {
            alert('Falla en la compilación del payload:\n' + err.message);
        }
    };

    document.getElementById('btn-tamper-write').onclick = function() {
        var k = document.getElementById('tamper-key').value.trim();
        var v = document.getElementById('tamper-val').value.trim();
        if(k) { localStorage.setItem(k, v); alert('Registro modificado en LocalStorage.'); }
    };

    document.getElementById('btn-detach-suite').onclick = function() { panel.remove(); styleEl.remove(); };
})();