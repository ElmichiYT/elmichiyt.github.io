/* WinAero.js - El motor de diálogos retro */

const WinAero = {
    // Método interno para construir el contenedor
    _create(type, title, message) {
        // Remover cualquier ventana existente para evitar duplicados
        const oldOverlay = document.querySelector('.winaero-overlay');
        if (oldOverlay) oldOverlay.remove();

        // Determinar el símbolo del icono clásico de Win 7
        let iconSymbol = '!';
        if (type === 'info') iconSymbol = 'i';

        // Crear la estructura HTML
        const overlay = document.createElement('div');
        overlay.className = 'winaero-overlay';
        
        overlay.innerHTML = `
            <div class="winaero-window">
                <div class="winaero-titlebar">
                    <span>${title}</span>
                    <div class="winaero-close-btn">✕</div>
                </div>
                <div class="winaero-container">
                    <div class="winaero-content">
                        <div class="winaero-icon ${type}">${iconSymbol}</div>
                        <div class="winaero-text">
                            <h2>${title}</h2>
                            <p>${message}</p>
                        </div>
                    </div>
                    <div class="winaero-action-bar">
                        <button class="winaero-btn">Aceptar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Disparar animaciones de CSS (Aero Effect)
        setTimeout(() => overlay.classList.add('active'), 10);

        // Función de cierre
        const closeWindow = () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 200); // Espera que termine la transición CSS
        };

        // Escuchar eventos de cierre (Botón X y Botón Aceptar)
        overlay.querySelector('.winaero-close-btn').addEventListener('click', closeWindow);
        overlay.querySelector('.winaero-btn').addEventListener('click', closeWindow);
    },

    // Disparadores Públicos API
    info(title, message) {
        this._create('info', title, message);
    },
    
    warning(title, message) {
        this._create('warning', title, message);
    },
    
    critical(title, message) {
        this._create('critical', title, message);
    }
};