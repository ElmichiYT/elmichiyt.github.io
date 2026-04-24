async function updateStatus() {
            const proxy = "https://api.allorigins.win/get?url=";
            const target = encodeURIComponent("https://www.classicube.net/api/servers");
            
            try {
                const response = await fetch(proxy + target);
                const rawData = await response.json();
                const data = JSON.parse(rawData.contents);
                
                const myServer = data.servers.find(s => s.hash === 'f22ee9510fff1405ce378a2c5fbb27b3');
                
                const dot = document.getElementById('status-indicator');
                const text = document.getElementById('status-text');
                const players = document.getElementById('player-count');
                const name = document.getElementById('server-name');
                const uptime = document.getElementById('server-time');

                if (myServer) {
                    dot.className = 'status-dot dot-on';
                    text.innerHTML = `En línea`;
                    name.innerHTML = `${myServer.name}`;
                    uptime.innerHTML = `${myServer.uptime}s`;
                    text.style.color = '#53FC18';
                    players.innerHTML = `${myServer.players}/${myServer.maxplayers}`;
                } else {
                    dot.className = 'status-dot dot-off';
                    text.innerHTML = `Fuera de línea`;
                    name.innerHTML = 'Desconocido';
                    uptime.innerHTML = 'Desconocido';
                    text.style.color = '#ff4444';
                    players.innerHTML = '0/0';
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('status-text').innerHTML = "Error de conexión";
            }
        }
        updateStatus();
        setInterval(updateStatus, 45000);