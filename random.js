const GROUP_ID = '625742';
const API = `https://api.zotero.org/groups/${GROUP_ID}/items/top`;

async function fetchTotal() {
  const res = await fetch(`${API}?limit=1`);
  if (!res.ok) throw new Error(`Zotero API ${res.status}`);
  const total = parseInt(res.headers.get('Total-Results'), 10);
  if (!Number.isFinite(total) || total < 1) throw new Error('Library is empty');
  return total;
}

async function fetchRandom(total) {
  const offset = Math.floor(Math.random() * total);
  const params = new URLSearchParams({
    start: String(offset),
    limit: '1',
    include: 'bib',
    style: 'mla',
  });
  const res = await fetch(`${API}?${params}`);
  if (!res.ok) throw new Error(`Zotero API ${res.status}`);
  const items = await res.json();
  if (!items.length) throw new Error('No item at offset ' + offset);
  return items[0];
}

function render(item) {
  const target = document.getElementById('citation');
  const link = item.links?.alternate?.href;
  const bib = item.bib || '<em>(no bibliography rendered)</em>';
  target.innerHTML = link
    ? `${bib} <a href="${link}" target="_blank" rel="noopener"><img src="icon_linkout.png" height="12" width="12" alt="Open in Zotero"></a>`
    : bib;
}

(async () => {
  try {
    const total = await fetchTotal();
    const item = await fetchRandom(total);
    render(item);
  } catch (err) {
    document.getElementById('citation').textContent = `Error: ${err.message}`;
  }
})();
