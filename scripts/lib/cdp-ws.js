/* Minimal CDP websocket client, zero dependency, same shape verify-live uses. */
const crypto = require('crypto'); const http = require('http');
module.exports = class {
  constructor(url) {
    const u = new URL(url); this.id = 0; this.waiting = new Map(); this.buf = Buffer.alloc(0);
    const key = crypto.randomBytes(16).toString('base64');
    this.ready = new Promise((res, rej) => {
      const req = http.request({ host: u.hostname, port: u.port, path: u.pathname + u.search, headers: { Connection: 'Upgrade', Upgrade: 'websocket', 'Sec-WebSocket-Key': key, 'Sec-WebSocket-Version': '13' } });
      req.on('upgrade', (r, sock) => { this.sock = sock; sock.on('data', (d) => this.onData(d)); res(); });
      req.on('error', rej); req.end();
    });
  }
  onData(d) {
    this.buf = Buffer.concat([this.buf, d]);
    for (;;) {
      if (this.buf.length < 2) return;
      let len = this.buf[1] & 127, off = 2;
      if (len === 126) { if (this.buf.length < 4) return; len = this.buf.readUInt16BE(2); off = 4; }
      else if (len === 127) { if (this.buf.length < 10) return; len = Number(this.buf.readBigUInt64BE(2)); off = 10; }
      if (this.buf.length < off + len) return;
      const payload = this.buf.subarray(off, off + len).toString();
      this.buf = this.buf.subarray(off + len);
      try { const m = JSON.parse(payload); if (m.id && this.waiting.has(m.id)) { this.waiting.get(m.id)(m); this.waiting.delete(m.id); } } catch {}
    }
  }
  send(method, params) {
    const id = ++this.id; const msg = Buffer.from(JSON.stringify({ id, method, params }));
    const mask = crypto.randomBytes(4); const n = msg.length;
    let head;
    if (n < 126) head = Buffer.from([0x81, 0x80 | n]);
    else if (n < 65536) { head = Buffer.alloc(4); head[0] = 0x81; head[1] = 0x80 | 126; head.writeUInt16BE(n, 2); }
    else { head = Buffer.alloc(10); head[0] = 0x81; head[1] = 0x80 | 127; head.writeBigUInt64BE(BigInt(n), 2); }
    const body = Buffer.from(msg); for (let i = 0; i < n; i++) body[i] ^= mask[i % 4];
    this.sock.write(Buffer.concat([head, mask, body]));
    return new Promise((res) => this.waiting.set(id, res));
  }
  close() { try { this.sock.destroy(); } catch {} }
};
