const express = require('express');
const app = express();
app.use(express.json());

let latestCommand = "WAIT"; 

// 學校 Chromebook 看到的黑客風畫面
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#000; color:#0f0; font-family:monospace; padding:20px;">
            <h2>[ TERMINAL CORE ]</h2>
            <p>Status: ONLINE</p>
            <p>Last Command: ${latestCommand}</p>
            <hr color="#0f0">
            <input type="text" id="cmd" placeholder="Enter command..." style="background:#000; color:#0f0; border:1px solid #0f0; padding:5px; width:300px;">
            <button onclick="sendCmd()" style="background:#0f0; color:#000; border:none; padding:5px 10px; cursor:pointer;">EXECUTE</button>
            
            <script>
                async function sendCmd() {
                    let cmd = document.getElementById('cmd').value;
                    await fetch('/send-command', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ command: cmd })
                    });
                    location.reload(); // 重新整理網頁看結果
                }
            </script>
        </body>
    `);
});

// 接收指令的網址
app.post('/send-command', (req, res) => {
    latestCommand = req.body.command;
    res.json({ success: true });
});

// 讓樹莓派可以抓取指令的網址
app.get('/get-command', (req, res) => {
    res.json({ command: latestCommand });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
