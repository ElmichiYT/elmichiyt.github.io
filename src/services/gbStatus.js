async function updateStatus() {
    const target = "https://cc-server-proxy.elmichiyt.workers.dev/";
    
    function formatUptime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        let parts = [];
        if (h > 0) parts.push(`${h} h`);
        if (m > 0 || h > 0) parts.push(`${m} m`);
        parts.push(`${s} s`);

        return parts.join(', ');
    }

    try {
        const response = await fetch(target);
        if (!response.ok) throw new Error("Error en el servidor");
        
        const data = await response.json();
        const myServer = data.servers.find(s => s.hash === 'f22ee9510fff1405ce378a2c5fbb27b3');
        
        const dot = document.getElementById('status-indicator');
        const text = document.getElementById('status-text');
        const players = document.getElementById('player-count');
        const name = document.getElementById('server-name');
        const uptime = document.getElementById('server-time');

        if (myServer && dot) {
            dot.className = 'status-dot dot-on';
            text.innerHTML = `En línea`;
            text.style.color = '#53FC18';
            name.innerHTML = myServer.name;
            uptime.innerHTML = formatUptime(myServer.uptime);
            players.innerHTML = `${myServer.players}/${myServer.maxplayers}`;
        } else if (dot) {
            dot.className = 'status-dot dot-off';
            text.innerHTML = `Fuera de línea`;
            text.style.color = '#ff4444';
            name.innerHTML = 'Desconocido';
            uptime.innerHTML = '0 s';
            players.innerHTML = '0/0';
        }
    } catch (error) {
        console.error('Error:', error);
        const st = document.getElementById('status-text');
        if (st) st.innerHTML = "Error de conexión";
    }
}

updateStatus();

setInterval(updateStatus, 15000);