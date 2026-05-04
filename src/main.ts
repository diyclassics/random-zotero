import './styles.css';
import { ZoteroError, fetchByKey, fetchRandomItem } from './zotero.ts';

const citation = document.getElementById('citation');
const reroll = document.getElementById('reroll') as HTMLButtonElement | null;
if (!citation) throw new Error('Missing #citation target');

const ITEM_PARAM = 'item';

function currentKey(): string | undefined {
  return new URLSearchParams(location.search).get(ITEM_PARAM) ?? undefined;
}

let currentItemKey: string | undefined = undefined;

async function load(key?: string): Promise<void> {
  if (reroll) reroll.disabled = true;
  citation!.setAttribute('aria-busy', 'true');
  citation!.textContent = 'Loading…';
  try {
    const [item, { renderItem }] = await Promise.all([
      key ? fetchByKey(key) : fetchRandomItem(currentItemKey),
      import('./render.ts'),
    ]);
    await renderItem(citation!, item);
    currentItemKey = item.key;
  } catch (err) {
    const msg = err instanceof ZoteroError ? err.message : 'Failed to load citation';
    citation!.textContent = `Error: ${msg}`;
  } finally {
    citation!.removeAttribute('aria-busy');
    if (reroll) reroll.disabled = false;
  }
}

reroll?.addEventListener('click', () => {
  void load();
});

window.addEventListener('popstate', () => {
  void load(currentKey());
});

void load(currentKey());
