import os
import random

from flask import Flask, render_template
from pyzotero import zotero

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])

library_id = os.getenv('LIBRARY_ID')
library_type = os.getenv('LIBRARY_TYPE')
api_key = os.getenv('API_KEY')

_items_cache = None


def _load_items():
    global _items_cache
    if _items_cache is None:
        z = zotero.Zotero(library_id, library_type, api_key)
        items = z.everything(z.top())
        z.add_parameters(content='bib', style='mla')
        citations = z.everything(z.top())
        for entry, citation in zip(items, citations):
            entry['citation'] = citation
        _items_cache = items
    return _items_cache


def _get_random_entry(items):
    return random.choice(items)


@app.route('/')
def homepage():
    items = _load_items()
    item = _get_random_entry(items)
    return render_template('random.html', title=None, item=item)


@app.route('/json')
def print_first_record():
    return render_template('json.html', item=_load_items()[0])


if __name__ == '__main__':
    app.run()
