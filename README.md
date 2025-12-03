# CryptoWatch (Flask version)

This repository contains a simple Flask app that serves the `index.html` template converted from the provided static HTML.

## Structure
- `app.py` — Flask application
- `templates/index.html` — main HTML template (original content)
- `static/css/style.css` — extracted CSS
- `static/js/main.js` — extracted JavaScript
- `requirements.txt` — Python dependencies

## Run locally
```bash
python -m venv venv
source venv/bin/activate   # macOS / Linux
venv\Scripts\activate    # Windows (PowerShell)
pip install -r requirements.txt
python app.py
```

Then open http://127.0.0.1:5000/

## Notes
- This is a straight conversion: the original inline CSS/JS were moved to static files.
- You can further refactor JS to fetch live data or use templates to inject dynamic content.
