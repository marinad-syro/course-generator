#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

# make pip stable & fresh
python -m pip install --upgrade pip

# install psycopg v3 binary first (pin a known good release)
python -m pip install --no-cache-dir "psycopg[binary]==3.2.11"

# then install the rest of your project's deps
python -m pip install --no-cache-dir -r requirements.txt

# collect static and run migrations
python manage.py collectstatic --no-input
python manage.py migrate

if [ "${CREATE_SUPERUSER:-}" = "true" ]; then
  echo ">>> Creating/Updating Django superuser (build time)"
  python - <<'PY'
import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "yourproject.settings")  # <- replace yourproject
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()

username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

if not username or not password:
    print("DJANGO_SUPERUSER_USERNAME or DJANGO_SUPERUSER_PASSWORD not set; skipping superuser creation.")
else:
    qs = User.objects.filter(username=username)
    if qs.exists():
        u = qs.first()
        u.set_password(password)
        u.is_staff = True
        u.is_superuser = True
        u.save()
        print(f"Updated password for existing superuser: {username}")
    else:
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"Created superuser: {username}")
PY
fi