const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', 'Allow': 'GET' });
        return res.end('Method Not Allowed. Sadece GET desteklenir.');
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/etkinlikler') {
        fs.readFile(path.join(__dirname, 'etkinlikler.json'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                return res.end(JSON.stringify({ hata: "Sunucu hatası" }));
            }
            
            let etkinlikler = JSON.parse(data);
            const tur = url.searchParams.get('tur');
            
            if (tur) {
                etkinlikler = etkinlikler.filter(e => e.tur === tur);
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(etkinlikler));
        });
    } 
    else if (url.pathname.startsWith('/api/etkinlikler/')) {
        const id = parseInt(url.pathname.split('/').pop());
        fs.readFile(path.join(__dirname, 'etkinlikler.json'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                return res.end(JSON.stringify({ hata: "Sunucu hatası" }));
            }
            const etkinlikler = JSON.parse(data);
            const etkinlik = etkinlikler.find(e => e.id === id);
            
            if (etkinlik) {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(etkinlik));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ hata: "Etkinlik bulunamadı" }));
            }
        });
    } 
    else {
        let filePath = path.join(__dirname, 'public', url.pathname === '/' ? 'index.html' : url.pathname);
        
        if (!filePath.startsWith(path.join(__dirname, 'public'))) {
            res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('Erişim engellendi.');
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html; charset=utf-8',
            '.js': 'text/javascript; charset=utf-8',
            '.css': 'text/css; charset=utf-8'
        };
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Dosya bulunamadı.');
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Sunucu hatası.');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} portunda dinleniyor...`);
});
