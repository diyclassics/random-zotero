import type { CslJsonItem } from './zotero.ts';

interface Engine {
  updateItems(ids: string[]): void;
  makeBibliography(): [unknown, string[]];
}

const CSL_URL = `${import.meta.env.BASE_URL}classical-world.csl`;
const LOCALE_URL = `${import.meta.env.BASE_URL}locales-en-US.xml`;

let enginePromise: Promise<Engine> | null = null;
let registry = new Map<string, CslJsonItem>();

function loadEngine(): Promise<Engine> {
  if (enginePromise) return enginePromise;
  enginePromise = (async () => {
    const [cslMod, styleXml, localeXml] = await Promise.all([
      import('citeproc'),
      fetch(CSL_URL).then((r) => r.text()),
      fetch(LOCALE_URL).then((r) => r.text()),
    ]);
    const CSL = cslMod.default;
    const sys = {
      retrieveLocale: () => localeXml,
      retrieveItem: (id: string) => {
        const item = registry.get(id);
        if (!item) throw new Error(`Missing CSL item ${id}`);
        return item;
      },
    };
    return new CSL.Engine(sys, styleXml, 'en-US') as unknown as Engine;
  })();
  return enginePromise;
}

export async function formatItem(raw: CslJsonItem, fallbackId: string): Promise<string> {
  const item = { ...raw, id: raw.id ?? fallbackId };
  registry = new Map([[item.id, item]]);
  const engine = await loadEngine();
  engine.updateItems([item.id]);
  const [, entries] = engine.makeBibliography();
  return entries.join('');
}
