import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export default function () {
  const dataDir = dirname(fileURLToPath(import.meta.url));
  const imgDir = join(dataDir, '../assets/img');
  const metaPath = join(dataDir, 'gallery-descriptions.json');
  const orderPath = join(dataDir, 'gallery-order.json');

  const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, 'utf8')) : {};
  const order = existsSync(orderPath) ? JSON.parse(readFileSync(orderPath, 'utf8')) : [];

  const allFiles = new Set(
    readdirSync(imgDir).filter(f => /\.(png|jpe?g|gif|webp|avif)$/i.test(f))
  );

  // Known images in their fixed shuffled order (excluding any that were deleted)
  const ordered = order.filter(f => allFiles.has(f));

  // New images not yet in the order file — appended at the end, sorted by filename
  const known = new Set(order);
  const newFiles = [...allFiles].filter(f => !known.has(f)).sort();

  return [...ordered, ...newFiles].map(f => ({
    src: `/assets/img/${f}`,
    alt: meta[f]?.description || f,
    description: meta[f]?.description || '',
  }));
}
