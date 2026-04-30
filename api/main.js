const https = require('https');

export default function handler(req, res) {
    // 1. DISFARCE: Se for navegador, mostra erro de manutenção (Status 200)
    if (req.headers['user-agent']?.includes('Mozilla')) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).end(`
            <body style="font-family:sans-serif; text-align:center; padding:50px; background:#f9f9f9;">
                <div style="max-width:400px; margin:auto; background:#fff; padding:20px; border:1px solid #eee;">
                    <h2>Serviço em Atualização</h2>
                    <p>Estamos otimizando nossos servidores. Tente novamente mais tarde.</p>
                </div>
            </body>
        `);
    }

    // 2. TÚNEL XHTTP: Encaminha para a sua VPS
    const options = {
        hostname: '137.131.143.111',
        port: 443,
        path: req.url,
        method: req.method,
        headers: {
            ...req.headers,
            'host': '137.131.143.111',
            'connection': 'keep-alive'
        },
        rejectUnauthorized: false
    };

    const proxyReq = https.request(options, (proxyRes) => {
        // Repassa o status e os headers vindos do Xray (geralmente 101 ou 200 no xHTTP)
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    // 3. SE A VPS FALHAR: Em vez de 400, manda o 503 (Service Unavailable)
    proxyReq.on('error', (err) => {
        console.error('Erro de Conexão:', err.message);
        res.status(503).end('Service Unavailable'); 
    });

    req.pipe(proxyReq);
}

export const config = {
    api: { bodyParser: false, externalResolver: true }
};
