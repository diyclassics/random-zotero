# Random Zotero
Wireframe for Random Zotero built on Python3/Flask. Displays a random entry from a Zotero library in a simple HTML page.

## Installation
- Install pipenv to get started
- Then run ```pipenv install``` to install all necessary Python packages
- When everything is installed, run ```python app.py``` to launch site

## Environment variables for Zotero
NB: You need to add an .env file with Zotero information to make this work. DO NOT COMMIT THIS FILE TO VERSION CONTROL. (It should be excluded by .gitignore.) The .env file should look like this:

```
APP_SETTINGS="config.DevelopmentConfig"
LIBRARY_ID='{REPLACETHIS}'
LIBRARY_TYPE='{REPLACETHIS}'
API_KEY='{REPLACETHIS}'
```