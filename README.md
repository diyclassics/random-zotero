# Random Zotero

Static page that displays a random entry from the public Zotero group library [*Annotated Bibliography of Digital Classics*](https://www.zotero.org/groups/625742/annotated_bibliography_of_digital_classics/library) (group `625742`).

The library is a public Zotero group, so the page calls the Zotero API directly from the browser — no backend, no API key, no build step.

## How it works

On every page load, the browser:

1. Reads the current item count from the `Total-Results` header of `api.zotero.org/groups/625742/items/top?limit=1`.
2. Picks a random offset `0..total-1`.
3. Fetches one item at that offset with the MLA bib HTML included (`include=bib&style=mla`).
4. Renders the citation in the page.

Two requests per visit, regardless of library size.

## Local development

No build step. Open `index.html` directly, or serve the folder over HTTP:

```
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

Hosted on GitHub Pages, served from the `main` branch root. Pushing to `main` deploys.

## Previous Flask version

The pre-rewrite Flask version is preserved at tag [`v0.1-flask`](../../tree/v0.1-flask).

---

*Written by Patrick J. Burns and Joseph Hartnett, October 2018; rewritten as a static site in May 2026.*
