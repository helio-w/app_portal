# AppPortal

Portail web simple pour recenser et partager les liens vers vos applications self-hosted. Une page unique, une seule URL à partager, au lieu de diffuser adresses IP et ports.

## Fonctionnalités

- Liste des applications self-hosted (nom, URL, icône)
- Configuration via l'interface d'administration Django
- Déploiement en un conteneur Docker, sans base de données externe

## Stack

- Python 3.14, Django 6.1
- Gunicorn + WhiteNoise (production)
- django-vite (React/Vite)
- Docker et Docker Compose (image multi-stage : `dev` / `production`)
- CI : GitHub Actions (build de l'image Docker)

## Démarrage rapide (Docker)

```bash
git clone https://github.com/helio-w/app_portal.git
cd app_portal
cp .env.example .env   # renseigner SECRET_KEY et les identifiants admin
docker compose up --build
```

Le portail est accessible sur http://localhost:8000. L'interface d'administration Django se trouve sur http://localhost:8000/admin.

L'override de développement (`docker-compose.override.yaml`) est appliqué automatiquement : il monte les sources, utilise `app_portal.settings.dev` et lance `runserver` avec rechargement à chaud.

## Production

```bash
docker compose -f docker-compose.yaml -f docker-compose.production.yaml up -d
```

L'image de production exécute Gunicorn derrière WhiteNoise avec `app_portal.settings.prod`, sous un utilisateur non-root. Variables principales :

| Variable | Requis | Description |
|---|---|---|
| `SECRET_KEY` | Oui | Clé secrète Django. Génération : `python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` |
| `DJANGO_ALLOWED_HOSTS` | Oui | Liste d'hôtes autorisés, séparés par des virgules (ex. `portal.example.org`) |
| `DJANGO_SETTINGS_MODULE` | Non | Valeur par défaut : `app_portal.settings.prod` |
| `DJANGO_SUPERUSER_USERNAME` / `DJANGO_SUPERUSER_PASSWORD` | Non | Création/mise à jour du superuser admin au démarrage (dev) |

## Développement local (sans Docker)

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

## Structure du projet

```
app_portal/        # Projet Django (settings : dev / prod)
apps/             # Application principale : modèles, vues, admin
templates/        # Templates Django
static/           # Fichiers statiques
scripts/          # Points d'entrée Docker (dev et prod)
```

## Feuille de route

- [x] Base fonctionnelle
- [ ] Internationalisation (i18n)
- [ ] Tags sur les applications
- [ ] Authentification
- [ ] Page « à propos » des applications

## Licence

Voir [LICENSE](LICENSE).
