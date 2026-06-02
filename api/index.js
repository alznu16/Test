const express = require('express');
const app = express();
app.use(express.json());

// 全域暫存指令（注意：Vercel 免費版內存在閒置時會重置，這拿來當文字測試剛好）
let latestCommand = "WAIT";

app.get('/api', (req, res) => {
    res.send(`
        <body style="background:#000; color:#0f0; font-family:monospace; padding:20px;">
            <h2>[ VERCEL TERMINAL ]</h2>
            <p>Status: ONLINE (Serverless)</p>
            <p>Last Command: ${latestCommand}</p>
            <hr color="#0f0">
            <input type="text" id="cmd" placeholder="Enter command..." style="background:#000; color:#0f0; border:1px solid #0f0; padding:5px; width:300px;">
            <button onclick="sendCmd()" style="background:#0f0; color:#000; border:none; padding:5px 10px; cursor:pointer;">EXECUTE</button>
            
            <script>
                async function sendCmd() {
                    let cmd = document.getElementById('cmd').value;
                    await fetch('/api/send', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ command: cmd })
                    });
                    location.reload();
                }
            </script>
        </body>
    `);
});

app.post('/api/send', (req, res) => {
    latestCommand = req.body.command;
    res.json({ success: true, saved: latestCommand });
});

app.get('/api/get', (req, res) => {
    res.json({ command: latestCommand });
});

module.exports = app; // 這是關鍵：Vercel 不需要 app.listen，而是要把 app 匯出
