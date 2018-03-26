import os
import random

from flask import Flask, render_template
from pyzotero import zotero

from pprint import pprint

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])

library_id = os.getenv('LIBRARY_ID')
library_type = os.getenv('LIBRARY_TYPE')
api_key = os.getenv('API_KEY')

z = zotero.Zotero(library_id, library_type, api_key)
isawbib_json = z.everything(z.top())
cit = z.add_parameters(content='bib', style='mla')
isawbib_cit = z.everything(z.top())


# More elegant way to write this?
for i, item in enumerate(isawbib_cit):
    isawbib_json[i]['citation'] = item

    
def _get_random_entry(items):
    return random.choice(items)

@app.route('/')
def homepage():
    items = isawbib_json
    item = _get_random_entry(items)
    return render_template('random.html', title=None, item=item)
    

@app.route('/json')
def print_first_record():
    return render_template('json.html', item=isawbib_json[0])


if __name__ == '__main__':
    app.run()