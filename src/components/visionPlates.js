// Генерация "ишихара"-подобных табличек на <canvas> — точки внутри цифры
// закрашены палитрой fg, снаружи — палитрой bg, с детерминированным (по
// сиду от самой цифры) псевдослучайным разбросом размера/позиции. Это игра-
// разминка, не медицинский тест на дальтонизм — см. текст в словаре (vision.*).
export const PLATES = [
  { digit: '12', correct: '12', options: ['17', '12', '21'], fg: ['#7fae54', '#8fbe5e', '#6ea047', '#96c56a'], bg: ['#e2a355', '#d98f3e', '#eab06a', '#c98436'] },
  { digit: '8', correct: '8', options: ['3', '8', '6'], fg: ['#c15b4a', '#b94d3d', '#cf6f5c', '#a9432f'], bg: ['#7fa06b', '#6f9459', '#8fae7c', '#5f8a4c'] },
  { digit: '5', correct: '5', options: ['2', '6', '5'], fg: ['#d98a3d', '#e0954a', '#cc7d31', '#e6a35c'], bg: ['#4f9a95', '#3f8983', '#5fa8a3', '#347a74'] },
  { digit: '29', correct: '29', options: ['70', '29', '26'], fg: ['#c85a7a', '#d0698a', '#bb4c6d', '#d97e9b'], bg: ['#5f9e5a', '#4f8f4a', '#71ad6a', '#438241'] },
];

export function generatePlateImage(digit, fg, bg, size) {
  const off = document.createElement('canvas');
  off.width = size; off.height = size;
  const octx = off.getContext('2d');
  octx.fillStyle = '#000';
  octx.font = `bold ${Math.floor(size * 0.74)}px Arial, sans-serif`;
  octx.textAlign = 'center'; octx.textBaseline = 'middle';
  octx.fillText(digit, size / 2, size / 2 + size * 0.03);
  const mask = octx.getImageData(0, 0, size, size).data;

  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();

  let seed = 0;
  for (let k = 0; k < digit.length; k++) seed = (seed * 31 + digit.charCodeAt(k)) >>> 0;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

  const dotCount = Math.floor((size * size) / 100);
  for (let i = 0; i < dotCount; i++) {
    const angle = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * (size / 2 - 4);
    const x = size / 2 + Math.cos(angle) * r;
    const y = size / 2 + Math.sin(angle) * r;
    const radius = 2.2 + rand() * 3.2;
    const idx = (Math.floor(y) * size + Math.floor(x)) * 4;
    const inside = mask[idx + 3] > 100;
    const palette = inside ? fg : bg;
    ctx.beginPath();
    ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  return canvas.toDataURL('image/png');
}

export function buildColorPlates(size = 260) {
  return PLATES.map((p) => ({ ...p, src: generatePlateImage(p.digit, p.fg, p.bg, size) }));
}
