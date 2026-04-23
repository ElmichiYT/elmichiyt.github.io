// Copyright 2026 ElmichiYT
// Código no Open Source
async function cargarAnuncioDesdeTexto() {
    const contenedor = document.getElementById('ad-container');
    if (!contenedor) return;

    try {
        const respuesta = await fetch('https://elmichiyt.github.io/src/services/ad-list.txt'); 
        const contenido = await respuesta.text();

        const bloques = contenido.split(/\n\s*\n/);
        const listaAnuncios = [];

        bloques.forEach(bloque => {
            const lineas = bloque.split('\n');
            let obj = {};
            lineas.forEach(linea => {
                if (linea.includes('imagen=')) {
                    obj.img = linea.split('"')[1];
                }
                if (linea.includes('enlace=')) {
                    obj.url = linea.split('"')[1];
                }
            });
            if (obj.img && obj.url) listaAnuncios.push(obj);
        });

        if (listaAnuncios.length > 0) {
            const randomAd = listaAnuncios[Math.floor(Math.random() * listaAnuncios.length)];

            const link = document.createElement('a');
            link.href = randomAd.url;
            link.target = "_blank";

            const image = document.createElement('img');
            image.src = randomAd.img;
            image.style.maxWidth = "100%";
            image.style.height = "auto";
            image.style.display = "block";

            link.appendChild(image);
            contenedor.appendChild(link);
        }
    } catch (error) {
        console.error("Error al cargar el anuncio:", error);
    }
}

document.addEventListener('DOMContentLoaded', cargarAnuncioDesdeTexto);