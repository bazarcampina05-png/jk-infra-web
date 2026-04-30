const https = require('https');

export default function handler(req, res) {
    // Se for um navegador acessando, mostra uma página de erro genérica (Disfarce)
    if (req.headers['user-agent']?.includes('Mozilla')) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.end(`
            <!DOCTYPE html>
            <html>
            <head><title>Página em Manutenção</title></head>
            <body style="font-family:Arial; text-align:center; padding:50px; background:#f4f4f4; color:#666;">
                <div style="max-width:500px; margin:auto; background:#fff; padding:30px; border-radius:8px; border:1px solid #ddd;">
                    <h1 style="color:#333;">Estamos em manutenção</h1>
                    <p>Desculpe o transtorno. No momento estamos realizando atualizações técnicas no nosso servidor.</p>
                    <p>O serviço deve ser normalizado em algumas horas.</p>
                    <hr style="border:0; border-top:1px solid #eee;">
                    <small>Copyright © 2026 JK Infraestrutura Digital</small>
                </div>
            </body>
            </html>
        `);
    }

    // Código do Túnel para o App VPN (Tráfego de dados)
    const options = {
        hostname: '167.234.237.25',
        port: 443,
        path: req.url,
        method: req.method,
        headers: {
            ...req.headers,
            'host': '167.234.237.25',
            'connection': 'keep-alive'
        },
        rejectUnauthorized: false
    };

    const proxyReq = https.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        res.status(502).end('GATEWAY_TIMEOUT');
    });

    req.pipe(proxyReq);
}

export const config = {
    api: { bodyParser: false, externalResolver: true }
};
