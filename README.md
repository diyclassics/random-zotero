# Random Zotero
Wireframe for Random Zotero built on Python3/Flask. Displays a random entry from a Zotero library in a simple HTML page.

## Installation
- Requires [uv](https://docs.astral.sh/uv/) (uv manages Python 3.13 for you)
- Install dependencies and create the virtual environment:
  ```
  uv sync
  ```
- Set the environment variables described below, then launch the site:
  ```
  uv run python app.py
  ```

## Environment variables for Zotero
NB: You need to add an .env file with Zotero information to make this work. DO NOT COMMIT THIS FILE TO VERSION CONTROL. (It should be excluded by .gitignore.) The .env file should look like this:

```
APP_SETTINGS="config.DevelopmentConfig"
LIBRARY_ID='{REPLACETHIS}'
LIBRARY_TYPE='{REPLACETHIS}'
API_KEY='{REPLACETHIS}'
```

*Written by Patrick J. Burns and Joseph Hartnett, October 2018; updated May 2026.*