const API_KEY = 'AIzaSyBYrAa7ysIXDRyhh3FR97hQU4KVX3qZNgA';
const PLAYLIST_ID = 'UUpSsnAZGjt9QLz4OoUCv53g';

async function actualizarUltimoVideo() {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=1&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].snippet.resourceId.videoId;
      
      // Seleccionamos tu iframe por su ID y cambiamos el src
      const iframe = document.getElementById('youtube-video');
      iframe.src = 'https://www.youtube.com/embed/' + videoId + '?rel=0';
      
    } else {
      console.warn("No se encontraron videos en la lista.");
    }
  } catch (error) {
    console.error("Error al obtener el video de YouTube:", error);
  }
}

// Ejecutamos la función
actualizarUltimoVideo();