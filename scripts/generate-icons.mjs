// Generates the PNG app icons from public/icon.svg.
// Run with `npm run icons` after changing the SVG, then commit the PNGs.
// The build and CI don't run this; they use the committed files.

import { readFile } from 'node:fs/promises'
import sharp from 'sharp'

const publicDir = new URL('../public/', import.meta.url)
const svg = await readFile(new URL('icon.svg', publicDir), 'utf8')

// Android crops maskable icons to a circle or squircle, and only the middle
// 80% is guaranteed to show. Shrink the art to fit inside that zone.
const ART_TAG = '<g id="art">'
if (!svg.includes(ART_TAG)) throw new Error(`public/icon.svg is missing ${ART_TAG}`)
const maskableSvg = svg.replace(ART_TAG, '<g id="art" transform="translate(256 256) scale(0.8) translate(-256 -256)">')

const outputs = [
  { file: 'apple-touch-icon-180.png', size: 180, source: svg },
  { file: 'pwa-192.png', size: 192, source: svg },
  { file: 'pwa-512.png', size: 512, source: svg },
  { file: 'pwa-maskable-512.png', size: 512, source: maskableSvg },
]

for (const { file, size, source } of outputs) {
  // Render at 2x then scale down for clean edges.
  await sharp(Buffer.from(source), { density: 144 })
    .resize(size, size)
    // iOS fills transparency with black anyway; removing alpha keeps the file
    // small and avoids a dark halo on the rounded corners.
    .flatten({ background: '#000000' })
    .png({ compressionLevel: 9 })
    .toFile(new URL(file, publicDir).pathname)
  console.log(`wrote public/${file}`)
}
