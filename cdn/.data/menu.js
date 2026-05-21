(function() {
    // Evitar duplicados: si ya existe el menú, lo borra antes de abrir uno nuevo
    var oldMenu = document.getElementById('web-mod-menu');
    if(oldMenu) oldMenu.remove();

    // 1. Contenedor principal del Mod Menu
    var menu = document.createElement('div');
    menu.id = 'web-mod-menu';
    menu.style = 'position:fixed;top:50px;left:50px;z-index:999999;background:#111216;color:#00ff66;padding:15px;border-radius:12px;border:2px solid #00ff66;width:320px;font-family:monospace;box-shadow:0 10px 30px rgba(0,0,0,0.7);font-size:12px;user-select:none;';
    
    // Hacerlo arrastrable (Drag and Drop)
    var isDragging = false; var offsetX, offsetY;
    menu.addEventListener('mousedown', function(e) {
        if(e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
        isDragging = true; offsetX = e.clientX - menu.offsetLeft; offsetY = e.clientY - menu.offsetTop;
    });
    document.addEventListener('mousemove', function(e) { if(isDragging) { menu.style.left = (e.clientX - offsetX) + 'px'; menu.style.top = (e.clientY - offsetY) + 'px'; } });
    document.addEventListener('mouseup', function() { isDragging = false; });

    // 2. Diseño de la Interfaz (HTML)
    var html = '<h3 style="margin:0 0 10px 0;color:#fff;text-align:center;border-bottom:1px solid #333;padding-bottom:5px;">👾 WEB MOD MENU v1.1</h3>';
    html += '<div style="color:#888;margin-bottom:10px;text-align:center;font-size:10px;">[Arrastra desde las zonas vacías]</div>';
    
    // Botones de Hacks visuales
    html += '<button id="mod-img" style="width:100%;background:#222;color:#00ff66;border:1px solid #00ff66;padding:6px;margin-bottom:8px;cursor:pointer;font-weight:bold;border-radius:4px;">📷 Extractor de Imágenes</button>';
    html += '<button id="mod-edit" style="width:100%;background:#222;color:#00ff66;border:1px solid #00ff66;padding:6px;margin-bottom:12px;cursor:pointer;font-weight:bold;border-radius:4px;">✍️ Alternar Modo Dios (Editar)</button>';

    // Editor LocalStorage
    html += '<div style="border-top:1px solid #333;padding-top:8px;">';
    html += '<b style="color:#ff00ff;">📦 Herramientas LocalStorage:</b><br/>';
    html += '<input id="mod-key" placeholder="Clave" style="background:#000;color:#fff;border:1px solid #333;padding:4px;width:35%;margin-top:5px;font-size:11px;border-radius:3px;"/> ';
    html += '<input id="mod-val" placeholder="Valor" style="background:#000;color:#fff;border:1px solid #333;padding:4px;width:35%;margin-top:5px;font-size:11px;border-radius:3px;"/> ';
    html += '<button id="mod-save" style="background:#00ff66;color:#000;border:none;padding:4px 8px;cursor:pointer;font-weight:bold;font-size:11px;border-radius:3px;">OK</button>';
    html += '<button id="mod-view-local" style="width:100%;background:#222;color:#ff00ff;border:1px solid #ff00ff;padding:4px;margin-top:5px;cursor:pointer;font-size:11px;border-radius:4px;">🔍 Ver claves en Consola (F12)</button>';
    html += '</div>';

    // Botón de cierre definitivo
    html += '<button id="mod-close" style="width:100%;background:#ff3333;color:#fff;border:none;padding:6px;margin-top:15px;cursor:pointer;font-weight:bold;border-radius:4px;">❌ Cerrar Menú</button>';
    
    menu.innerHTML = html;
    document.body.appendChild(menu);

    // 3. Inyección de la Lógica Operativa
    document.getElementById('mod-img').onclick = function() {
        var imgs = document.getElementsByTagName('img'); var w = window.open();
        w.document.write('<html><head><title>Imágenes Extraídas</title></head><body style="background:#111;color:#fff;font-family:sans-serif;"><h1>Imágenes de la página:</h1><div style="display:flex;flex-wrap:wrap;gap:10px;">');
        for(var i=0;i<imgs.length;i++){ if(imgs[i].src) w.document.write('<div style="background:#222;padding:10px;border-radius:8px;"><img src="'+imgs[i].src+'" style="max-height:150px;display:block;margin-bottom:5px;"/><a href="'+imgs[i].src+'" target="_blank" style="color:#00ff66;font-size:12px;">URL Original</a></div>'); }
        w.document.write('</div></body></html>'); w.document.close();
    };

    var editing = false;
    document.getElementById('mod-edit').onclick = function() {
        editing = !editing;
        document.body.contentEditable = editing ? 'true' : 'false';
        document.designMode = editing ? 'on' : 'off';
        this.style.background = editing ? '#00ff66' : '#222';
        this.style.color = editing ? '#000' : '#00ff66';
    };

    document.getElementById('mod-save').onclick = function() {
        var k = document.getElementById('mod-key').value.trim();
        var v = document.getElementById('mod-val').value.trim();
        if(k) { localStorage.setItem(k, v); alert('Guardado en LocalStorage:\n' + k + ' = ' + v + '\n\n(Recarga la página para aplicar los cambios)'); }
    };

    document.getElementById('mod-view-local').onclick = function() {
        console.log('%c--- DATOS LOCALSTORAGE ---', 'color: #ff00ff; font-weight: bold; font-size: 14px;');
        for(var i=0; i<localStorage.length; i++) {
            console.log('%c' + localStorage.key(i) + ':', 'color: #00ff66;', localStorage.getItem(localStorage.key(i)));
        }
        alert('Datos impresos con estilo en la Consola (Presiona F12).');
    };

    document.getElementById('mod-close').onclick = function() { menu.remove(); };
})();