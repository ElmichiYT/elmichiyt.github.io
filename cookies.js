(function() {
    // === 1. FUNCIONES PARA MANEJAR LA COOKIE ===
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // === 2. LÓGICA PRINCIPAL ===
    document.addEventListener("DOMContentLoaded", function() {
        // Si la cookie "cookie_msg" ya existe, no hacemos absolutamente nada
        if (getCookie("cookie_msg")) {
            return; 
        }

        // === 3. INYECTAR ESTILOS CSS ===
        const css = `
            #cookie-banner {
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background-color: #333;
                color: #ffffff;
                padding: 16px 24px;
                text-align: center;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.4);
                z-index: 9999;
                font-family: sans-serif;
                font-size: 14px;
                display: block;
                justify-content: center;
                align-items: center;
                gap: 15px;
                flex-wrap: wrap;
            }
            #accept-cookie-btn {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 8px 18px;
                cursor: pointer;
                border-radius: 4px;
                font-weight: bold;
                transition: background 0.2s ease;
            }
            #accept-cookie-btn:hover {
                background-color: #45a049;
            }
        `;
        
        const styleSheet = document.createElement("style");
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);

        // === 4. INYECTAR EL HTML ===
        const banner = document.createElement("div");
        banner.id = "cookie-banner";
        banner.innerHTML = `
            <img src="\cookie.svg"><br>
            <span>Este sitio utiliza Cookies para la mejora de tu instancia. Así como la de otros recursos externos.</span><br>
            <span>Para más información, vaya a <a href="/policy/cookies">Política de Cookies</a><br><br>
            <button id="accept-cookie-btn">Aceptar</button>
        `;
        document.body.appendChild(banner);

        // === 5. EVENTO DEL BOTÓN ===
        const acceptBtn = document.getElementById("accept-cookie-btn");
        acceptBtn.addEventListener("click", function() {
            // Guardamos la cookie por 7 días
            setCookie("cookie_msg", "true", 7);
            // Removemos el banner del HTML por completo
            banner.remove();
        });
    });
})();