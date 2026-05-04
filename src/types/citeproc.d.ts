declare module 'citeproc' {
  export type CslJsonItem = Record<string, unknown> & { id: string };

  export interface Sys {
    retrieveLocale(lang: string): string;
    retrieveItem(id: string): CslJsonItem;
  }

  export class Engine {
    constructor(sys: Sys, style: string, lang?: string, forceLang?: boolean);
    updateItems(ids: string[]): void;
    makeBibliography(): [unknown, string[]];
  }

  const CSL: { Engine: typeof Engine };
  export default CSL;
}
