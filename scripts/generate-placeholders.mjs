/**
 * Generador de imágenes placeholder para Flora Magdalena.
 *
 *   npm run placeholders
 *
 * Crea composiciones florales abstractas en SVG usando la paleta de marca.
 * Son 100% originales, pesan pocos KB y sirven de relleno hasta tener
 * fotografía real. Para reemplazarlas basta con dejar un archivo con el
 * mismo nombre (jpg/webp) en `src/assets/images/` y actualizar la extensión
 * en el glob de `src/data/images.ts`.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'images');

/* ---------- utilidades ---------- */

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** PRNG determinista: la misma semilla siempre produce la misma imagen. */
function rng(seed) {
  let a = hash(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n) => Math.round(n * 100) / 100;

/* ---------- paletas ---------- */

const PALETTES = {
  rose: {
    bg: ['#fbf4f2', '#f2e2dc'],
    petals: ['#f7e3dd', '#eecdc3', '#dfb1a4', '#cd9f92'],
    heart: '#b49157',
    leaf: ['#a7b394', '#8b9878', '#6f7d5c'],
  },
  ivory: {
    bg: ['#fdfbf7', '#f2ebdf'],
    petals: ['#fdfaf4', '#f4ecdd', '#e7dbc6', '#d9c9b4'],
    heart: '#b49157',
    leaf: ['#b6c0a4', '#93a17f', '#6f7d5c'],
  },
  olive: {
    bg: ['#f4f6f0', '#e4e9dc'],
    petals: ['#f7f4ea', '#e8e2d0', '#cfd6bd', '#a7b394'],
    heart: '#8b9878',
    leaf: ['#8b9878', '#6f7d5c', '#45503a'],
  },
  clay: {
    bg: ['#f8f2ea', '#ecdfcd'],
    petals: ['#f7ece0', '#eed9c3', '#dcc09f', '#c9a37c'],
    heart: '#9d6d60',
    leaf: ['#a7b394', '#7d8a68', '#59654a'],
  },
  dusk: {
    bg: ['#f6f2f1', '#e6dcdd'],
    petals: ['#f4ecec', '#e6d5d6', '#cfb6b8', '#b49a9c'],
    heart: '#b49157',
    leaf: ['#9aa68a', '#7d8a68', '#59654a'],
  },
};
const PALETTE_KEYS = Object.keys(PALETTES);

/* ---------- primitivas de dibujo ---------- */

function bloom(rand, cx, cy, radius, palette, layers = 3) {
  const parts = [];
  const petals = 5 + Math.floor(rand() * 4);
  const spin = rand() * 360;

  for (let layer = layers; layer >= 1; layer--) {
    const scale = layer / layers;
    const rr = radius * scale;
    const color = palette.petals[Math.min(palette.petals.length - 1, layers - layer + 1)];
    const offset = spin + layer * (180 / petals);
    for (let i = 0; i < petals; i++) {
      const angle = offset + (i * 360) / petals + (rand() - 0.5) * 8;
      parts.push(
        `<ellipse cx="${r2(cx)}" cy="${r2(cy - rr * 0.5)}" rx="${r2(rr * 0.38)}" ry="${r2(rr * 0.62)}" fill="${color}" opacity="${r2(0.82 + rand() * 0.16)}" transform="rotate(${r2(angle)} ${r2(cx)} ${r2(cy)})"/>`,
      );
    }
  }
  parts.push(
    `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(radius * 0.17)}" fill="${palette.petals[0]}"/>`,
    `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(radius * 0.1)}" fill="${palette.heart}" opacity="0.75"/>`,
  );
  return parts.join('');
}

function leaf(rand, cx, cy, length, angle, palette) {
  const color = palette.leaf[Math.floor(rand() * palette.leaf.length)];
  return `<ellipse cx="${r2(cx)}" cy="${r2(cy - length * 0.5)}" rx="${r2(length * 0.19)}" ry="${r2(length * 0.52)}" fill="${color}" opacity="${r2(0.62 + rand() * 0.28)}" transform="rotate(${r2(angle)} ${r2(cx)} ${r2(cy)})"/>`;
}

function stem(baseX, baseY, tipX, tipY, palette, width) {
  const mx = (baseX + tipX) / 2 + (tipX - baseX) * 0.18;
  const my = (baseY + tipY) / 2;
  return `<path d="M ${r2(baseX)} ${r2(baseY)} Q ${r2(mx)} ${r2(my)} ${r2(tipX)} ${r2(tipY)}" fill="none" stroke="${palette.leaf[palette.leaf.length - 1]}" stroke-width="${r2(width)}" stroke-linecap="round" opacity="0.55"/>`;
}

/**
 * Composición floral abstracta. `variant` desplaza el encuadre y la densidad
 * para que las miniaturas de un mismo producto no sean idénticas.
 */
function composition({ seed, width, height, variant = 0, palette }) {
  const rand = rng(`${seed}::${variant}`);
  const p = palette;
  const baseX = width * (0.5 + (rand() - 0.5) * 0.08);
  const baseY = height * 1.02;
  const spread = width * (0.3 + variant * 0.04);
  const count = 5 + Math.floor(rand() * 4) + (variant % 2);
  const zoom = 1 + variant * 0.08;

  const stems = [];
  const leaves = [];
  const blooms = [];

  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const angle = (t - 0.5) * (variant === 2 ? 150 : 120);
    const reach = height * (0.34 + rand() * 0.24);
    const cx = baseX + Math.sin((angle * Math.PI) / 180) * spread * (0.6 + rand() * 0.6);
    const cy = baseY - reach * zoom;
    const radius = width * (0.085 + rand() * 0.075) * zoom;

    stems.push(stem(baseX, baseY, cx, cy, p, width * 0.011));
    leaves.push(leaf(rand, baseX + (cx - baseX) * 0.55, baseY - reach * 0.45, height * (0.13 + rand() * 0.1), angle * 1.25, p));
    blooms.push({ cx, cy, radius, depth: cy });
  }

  // Follaje de fondo
  for (let i = 0; i < 5; i++) {
    leaves.unshift(
      leaf(rand, baseX + (rand() - 0.5) * spread * 2.1, baseY - height * (0.16 + rand() * 0.3), height * (0.16 + rand() * 0.14), (rand() - 0.5) * 170, p),
    );
  }

  blooms.sort((a, b) => a.depth - b.depth);

  return `${stems.join('')}${leaves.join('')}${blooms.map((b) => bloom(rand, b.cx, b.cy, b.radius, p)).join('')}`;
}

function svg({ seed, width, height, variant = 0, paletteKey }) {
  const key = paletteKey ?? PALETTE_KEYS[hash(seed) % PALETTE_KEYS.length];
  const palette = PALETTES[key];
  const id = `g${hash(`${seed}${variant}`) % 100000}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${palette.bg[0]}"/>
      <stop offset="1" stop-color="${palette.bg[1]}"/>
    </linearGradient>
    <radialGradient id="glow${id}" cx="0.5" cy="0.38" r="0.62">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg${id})"/>
  <rect width="${width}" height="${height}" fill="url(#glow${id})"/>
  ${composition({ seed, width, height, variant, palette })}
</svg>`;
}

/* ---------- catálogo de imágenes a generar ---------- */

const PRODUCT_IDS = [
  'bouquet-aurora',
  'bouquet-serena',
  'jardin-eterno',
  'bouquet-primavera',
  'rosas-de-luna',
  'jardin-silvestre',
  'caja-amor',
  'florero-alba',
  'botanical-garden',
  'bouquet-romance',
  'eternal-rose',
  'golden-garden',
  'cupula-selene',
  'bouquet-girasol',
  'ramo-magdalena',
  'caja-dulce-encuentro',
  'set-ritual-de-te',
  'vela-jardin-de-higuera',
  'difusor-bruma-de-lino',
  'bandeja-terracota',
  'cesta-celebracion',
  'orquidea-sofia',
  'corona-botanica',
  'bouquet-petit-rose',
];

mkdirSync(OUT_DIR, { recursive: true });
for (const file of readdirSync(OUT_DIR).filter((f) => f.endsWith('.svg'))) {
  unlinkSync(join(OUT_DIR, file));
}

const written = [];
const write = (name, content) => {
  writeFileSync(join(OUT_DIR, `${name}.svg`), content, 'utf8');
  written.push(name);
};

// Producto: 3 tomas por producto en 4:5
for (const id of PRODUCT_IDS) {
  for (let v = 0; v < 3; v++) {
    write(`${id}-${v + 1}`, svg({ seed: id, width: 800, height: 1000, variant: v }));
  }
}

// Categorías 3:4
const CATEGORY_PALETTES = {
  'flores-frescas': 'rose',
  'flores-eternas': 'clay',
  regalos: 'dusk',
  hogar: 'olive',
};
for (const [slug, paletteKey] of Object.entries(CATEGORY_PALETTES)) {
  write(`categoria-${slug}`, svg({ seed: `cat-${slug}`, width: 900, height: 1200, variant: 1, paletteKey }));
}

// Piezas editoriales
write('hero-principal', svg({ seed: 'hero-principal', width: 1200, height: 1500, variant: 1, paletteKey: 'ivory' }));
write('hero-secundario', svg({ seed: 'hero-secundario', width: 900, height: 1200, variant: 0, paletteKey: 'rose' }));
write('editorial-arte-de-regalar', svg({ seed: 'editorial-regalar', width: 1200, height: 1500, variant: 1, paletteKey: 'clay' }));
write('editorial-taller', svg({ seed: 'editorial-taller', width: 1200, height: 900, variant: 2, paletteKey: 'olive' }));
write('nosotros-taller', svg({ seed: 'nosotros-taller', width: 1400, height: 1000, variant: 1, paletteKey: 'ivory' }));
write('nosotros-detalle', svg({ seed: 'nosotros-detalle', width: 900, height: 1100, variant: 0, paletteKey: 'dusk' }));
write('contacto-atelier', svg({ seed: 'contacto-atelier', width: 1200, height: 900, variant: 2, paletteKey: 'rose' }));

// Galería tipo Instagram 1:1
for (let i = 1; i <= 6; i++) {
  write(`inspiracion-${i}`, svg({ seed: `inspiracion-${i}`, width: 800, height: 800, variant: i % 3 }));
}

// Fallback
write('placeholder', svg({ seed: 'placeholder', width: 800, height: 1000, variant: 0, paletteKey: 'ivory' }));

/* ---------- assets estáticos de marca ---------- */

const PUBLIC_DIR = join(OUT_DIR, '..', '..', '..', 'public');
mkdirSync(PUBLIC_DIR, { recursive: true });

writeFileSync(
  join(PUBLIC_DIR, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#211e19"/>
  <g fill="none" stroke="#eae0d1" stroke-width="2.6" stroke-linecap="round">
    <path d="M32 47V27"/>
    <path d="M32 33c-7 0-11-4-11-9 6 0 11 3 11 9Z"/>
    <path d="M32 33c7 0 11-4 11-9-6 0-11 3-11 9Z"/>
  </g>
  <circle cx="32" cy="21" r="4.6" fill="#b49157"/>
</svg>`,
  'utf8',
);

writeFileSync(
  join(PUBLIC_DIR, 'og-image.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="og" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="#fdfbf7"/>
      <stop offset="1" stop-color="#eee5d6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#og)"/>
  ${composition({ seed: 'og', width: 1200, height: 630, variant: 2, palette: PALETTES.rose })}
  <rect width="1200" height="630" fill="#fcfaf6" opacity="0.55"/>
  <text x="600" y="300" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="86" fill="#211e19">Flora Magdalena</text>
  <text x="600" y="356" text-anchor="middle" font-family="Inter, sans-serif" font-size="22" letter-spacing="6" fill="#6b6459">TALLER DE DISEÑO FLORAL</text>
</svg>`,
  'utf8',
);

console.log(`✓ ${written.length} imágenes generadas en src/assets/images`);
console.log('✓ public/favicon.svg y public/og-image.svg actualizados');
