// Capturas de una página en Chrome sin ventana, a distintas posiciones de scroll.
// Uso: node shoot.mjs <url> <carpeta-salida> <ancho> <alto> <y1,y2,...>   (y en altos de pantalla)
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
const [url, out, W, H, ys] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const CH = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(CH, ['--headless=new', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars',
  `--window-size=${W},${H}`, `--remote-debugging-port=${port}`, `--user-data-dir=${out}/.chrome-${port}`, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let targets;
for (let k = 0; k < 50; k++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (targets.find(t => t.type === 'page')) break; } catch {} await sleep(200); }
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const logs = [];
ws.onmessage = ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === 'Runtime.exceptionThrown') logs.push('ERROR ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
};
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url });
await sleep(4500);
for (const y of ys.split(',')) {
  await send('Runtime.evaluate', { expression: `scrollTo(0, ${y} * innerHeight)` });
  await sleep(2200);
  const r = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(`${out}/${W}x${H}_${y}.png`, Buffer.from(r.result.data, 'base64'));
}
console.log(logs.join('\n') || 'sin errores');
ws.close(); chrome.kill();
