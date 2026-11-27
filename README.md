# AppPoral

I was tired of giving my GF ips of self-hosted apps so I created this simple portal. This is a simple, old school project.

## Dev

```sh
pip install -r requirements-dev.txt
mkdir data
python manage.py migrate && python manage.py runserver   # API + admin on :8000
cd frontend && npm ci && npm run dev                      # portal on :5173
```
