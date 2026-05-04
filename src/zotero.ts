const GROUP_ID = '625742';
const API = `https://api.zotero.org/groups/${GROUP_ID}/items/top`;
const ITEM_API = `https://api.zotero.org/groups/${GROUP_ID}/items`;

export interface CslJsonItem {
  id: string;
  type?: string;
  title?: string;
  [key: string]: unknown;
}

export interface ZoteroItem {
  key: string;
  csljson?: CslJsonItem;
  links?: {
    alternate?: { href?: string };
  };
}

export class ZoteroError extends Error {}

async function fetchTotal(): Promise<number> {
  const res = await fetch(`${API}?limit=1`);
  if (!res.ok) throw new ZoteroError(`Zotero API ${res.status}`);
  const total = parseInt(res.headers.get('Total-Results') ?? '', 10);
  if (!Number.isFinite(total) || total < 1) {
    throw new ZoteroError('Library is empty');
  }
  return total;
}

async function fetchAtOffset(offset: number): Promise<ZoteroItem> {
  const params = new URLSearchParams({
    start: String(offset),
    limit: '1',
    include: 'csljson',
  });
  const res = await fetch(`${API}?${params}`);
  if (!res.ok) throw new ZoteroError(`Zotero API ${res.status}`);
  const items = (await res.json()) as ZoteroItem[];
  const item = items[0];
  if (!item) throw new ZoteroError(`No item at offset ${offset}`);
  return item;
}

export async function fetchRandomItem(excludeKey?: string): Promise<ZoteroItem> {
  const total = await fetchTotal();
  if (total <= 1) return fetchAtOffset(0);
  for (let attempt = 0; attempt < 8; attempt++) {
    const offset = Math.floor(Math.random() * total);
    const item = await fetchAtOffset(offset);
    if (!excludeKey || item.key !== excludeKey) return item;
  }
  throw new ZoteroError('Could not find a different random item');
}

export async function fetchByKey(key: string): Promise<ZoteroItem> {
  const params = new URLSearchParams({ include: 'csljson' });
  const res = await fetch(`${ITEM_API}/${encodeURIComponent(key)}?${params}`);
  if (!res.ok) throw new ZoteroError(`Zotero API ${res.status}`);
  return (await res.json()) as ZoteroItem;
}
