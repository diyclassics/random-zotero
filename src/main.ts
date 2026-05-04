import './styles.css';
import { ZoteroError, fetchByKey, fetchRandomItem } from './zotero.ts';

const citation = document.getElementById('citation');
const reroll = document.getElementById('reroll') as HTMLButtonElement | null;
if (!citation) throw new Error('Missing #citation target');

const ITEM_PARAM = 'item';

async function load(key?: string): Promise<string | undefined> {
  if (reroll) reroll.disabled = true;
  citation!.setAttribute('aria-busy', 'true');
  citation!.textContent = 'Loading…';
  try {
    const [item, { renderItem }] = await Promise.all([
      key ? fetchByKey(key) : fetchRandomItem(currentKey()),
      import('./render.ts'),
    ]);
    await renderItem(citation!, item);
    return item.key;
  } catch (err) {
    const msg = err instanceof ZoteroError ? err.message : 'Failed to load citation';
    citation!.textContent = `Error: ${msg}`;
    return undefined;
  } finally {
    citation!.removeAttribute('aria-busy');
    if (reroll) reroll.disabled = false;
  }
}

function urlForKey(key: string): string {
  const url = new URL(location.href);
  url.searchParams.set(ITEM_PARAM, key);
  return url.toString();
}

function currentKey(): string | undefined {
  return new URLSearchParams(location.search).get(ITEM_PARAM) ?? undefined;
}

reroll?.addEventListener('click', async () => {
  const key = await load();
  if (key) history.pushState(null, '', urlForKey(key));
});

window.addEventListener('popstate', () => {
  void load(currentKey());
});

(async () => {
  const initial = currentKey();
  const key = await load(initial);
  // On a first visit without ?item=, replace the URL so it becomes shareable
  // (no extra history entry).
  if (key && !initial) history.replaceState(null, '', urlForKey(key));
})();
