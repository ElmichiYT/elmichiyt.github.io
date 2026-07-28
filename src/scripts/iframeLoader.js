/**
 * IframeLoader Plugin v3.0 (Fixed)
 * Mide el iframe y le encima el loader sin moverlo del DOM.
 */
(function () {
    // 1. Inyectar estilos globales
    const style = document.createElement('style');
    style.textContent = `
      .iframe-loader-overlay {
        position: absolute;
        background-color: #f0f0f0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        pointer-events: none;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        box-sizing: border-box;
      }
  
      .iframe-loader-overlay img {
        width: 50px;
        height: 50px;
        object-fit: contain;
      }
  
      .iframe-loader-overlay.hidden {
        opacity: 0;
        visibility: hidden;
      }
    `;
    document.head.appendChild(style);
  
    // 2. Función para aplicar el loader encima del iframe
    function applyLoader(iframe) {
      if (iframe.dataset.loaderProcessed || iframe.classList.contains('no-loader')) return;
      iframe.dataset.loaderProcessed = 'true';
  
      const gifSrc = iframe.dataset.loaderGif || 'https://elmichiyt.github.io/src/loader/gif_prueba1.gif';
  
      // Crear la pantalla de carga
      const overlay = document.createElement('div');
      overlay.className = 'iframe-loader-overlay';
  
      const img = document.createElement('img');
      img.src = gifSrc;
      img.alt = 'Cargando...';
      overlay.appendChild(img);
  
      // Función para posicionar el loader exactamente encima del iframe
      function syncPosition() {
        const rect = iframe.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  
        // Si el iframe aún no tiene tamaño visible (ej. CSS no ha cargado), reintentar
        if (rect.width === 0 && rect.height === 0) {
          requestAnimationFrame(syncPosition);
          return;
        }
  
        overlay.style.top = `${rect.top + scrollTop}px`;
        overlay.style.left = `${rect.left + scrollLeft}px`;
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
      }
  
      // Insertar el overlay en el body
      document.body.appendChild(overlay);
      syncPosition();
  
      // Re-sincronizar si cambia el tamaño de ventana mientras carga
      window.addEventListener('resize', syncPosition);
  
      // Función para ocultar y limpiar
      const hideOverlay = () => {
        overlay.classList.add('hidden');
        window.removeEventListener('resize', syncPosition);
        setTimeout(() => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 400);
      };
  
      // Escuchar cuando el iframe termine de cargar
      iframe.addEventListener('load', hideOverlay, { once: true });
  
      // Fallback de seguridad: si el iframe tarda más de 10s, quitar el loader
      setTimeout(hideOverlay, 30000);
    }
  
    // 3. Escanear nodos
    function scan(node = document) {
      if (!node.querySelectorAll && node.tagName !== 'IFRAME') return;
  
      if (node.tagName === 'IFRAME') {
        applyLoader(node);
      } else {
        const iframes = node.querySelectorAll('iframe');
        iframes.forEach(applyLoader);
      }
    }
  
    // 4. Observer para iframes dinámicos
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => scan(node));
      });
    });
  
    function init() {
      scan(document);
      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();