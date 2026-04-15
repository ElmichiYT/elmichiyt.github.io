// Contenido de script.js
async function cargarUltimoVideo() {
    const API_KEY = 'AIzaSyBYrAa7ysIXDRyhh3FR97hQU4KVX3qZNgA';
    const PLAYLIST_ID = 'UUpSsnAZGjt9QLz40oUCv53g';
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const videoId = data.items[0].snippet.resourceId.videoId;
            document.getElementById('youtube-video').src = `https://www.youtube.com/embed/${videoId}`;
        }
    } catch (error) {
        console.error("Se produjo un error:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarUltimoVideo);