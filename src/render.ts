import type { ZoteroItem } from './zotero.ts';
import { formatItem } from './citeproc.ts';

export async function renderItem(target: HTMLElement, item: ZoteroItem): Promise<void> {
  if (!item.csljson) {
    target.innerHTML = '<em>(no bibliography data)</em>';
    return;
  }

  const formatted = await formatItem(item.csljson, item.key);
  const tmpl = document.createElement('template');
  tmpl.innerHTML = formatted;

  walk(tmpl.content);

  const link = item.links?.alternate?.href;
  if (link) {
    tmpl.content.appendChild(buildZoteroLink(link));
  }

  target.innerHTML = tmpl.innerHTML;
}

function buildZoteroLink(href: string): HTMLAnchorElement {
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener';
  a.className = 'linkout';
  a.textContent = 'View on Zotero ↗';
  return a;
}

const URL_RE = /https?:\/\/[^\s<>"]+/g;
const TRAILING_PUNCT_RE = /[.,;:)\]]+$/;

function walk(node: Node): void {
  if (node.nodeType === Node.TEXT_NODE) {
    linkifyTextNode(node as Text);
    return;
  }
  if (node.nodeName === 'A') return;
  for (const child of Array.from(node.childNodes)) {
    walk(child);
  }
}

function linkifyTextNode(node: Text): void {
  const text = node.textContent ?? '';
  if (!URL_RE.test(text)) {
    URL_RE.lastIndex = 0;
    return;
  }
  URL_RE.lastIndex = 0;

  const fragment = document.createDocumentFragment();
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  while ((match = URL_RE.exec(text)) !== null) {
    let url = match[0];
    let trailing = '';
    const tp = url.match(TRAILING_PUNCT_RE);
    if (tp) {
      trailing = tp[0];
      url = url.slice(0, -trailing.length);
    }
    if (match.index > lastIdx) {
      fragment.appendChild(document.createTextNode(text.slice(lastIdx, match.index)));
    }
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = url;
    fragment.appendChild(a);
    if (trailing) fragment.appendChild(document.createTextNode(trailing));
    lastIdx = match.index + url.length + trailing.length;
  }
  if (lastIdx < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIdx)));
  }
  node.parentNode?.replaceChild(fragment, node);
}
