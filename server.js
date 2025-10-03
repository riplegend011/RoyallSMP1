const express = require('express');
const { status } = require('minecraft-server-util');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const serverIP = 'play.royallsmp.fun';
const serverPort = 5299; // Your Java port

app.get('/api/server-status', async (req, res) => {
    try {
        const serverStatus = await status(serverIP, serverPort, {
            timeout: 5000,
            enableSRV: true
        });

        res.json({
            online: true,
            host: serverIP,
            port: serverPort,
            version: serverStatus.version ?? 'Unknown',
            motd: serverStatus.motd?.clean ?? '',
            players: {
                online: serverStatus.players?.online ?? 0,
                max: serverStatus.players?.max ?? 0
            }
        });
    } catch (err) {
        console.error('Error querying server:', err);
        res.json({
            online: false,
            host: serverIP,
            port: serverPort,
            error: err.message
        });
    }
});

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});




